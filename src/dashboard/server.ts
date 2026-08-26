import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { fileURLToPath } from 'url';
import { config } from '../config.js';
import { db } from '../database/db.js';
import { qrManager } from '../whatsapp/qrManager.js';
import { chatEvents } from '../whatsapp/messageHandler.js';
import { geminiService } from '../ai/gemini.js';
import { whatsappClient } from '../whatsapp/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = fs.existsSync(path.join(config.rootDir, 'src', 'dashboard', 'public'))
  ? path.join(config.rootDir, 'src', 'dashboard', 'public')
  : path.join(__dirname, 'public');

export function createDashboardServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(cors());
  app.use(express.json());
  app.use(express.static(publicDir));
  app.use('/media', express.static(config.mediaDir));

  // --- REST Endpoints ---
  app.get('/api/status', (req, res) => {
    const status = qrManager.getStatus();
    res.json({
      ...status,
      aiConfigured: geminiService.isConfigured(),
      businessName: config.business.business.name,
      geminiModel: config.geminiModel
    });
  });

  app.post('/api/settings/apikey', (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) return res.status(400).json({ error: 'API key is required' });
    geminiService.updateApiKey(apiKey);
    res.json({ success: true, message: 'Gemini API Key updated successfully.' });
  });

  app.get('/api/orders', (req, res) => {
    res.json(db.getOrders());
  });

  app.patch('/api/orders/:id', (req, res) => {
    const { status, paymentStatus } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, paymentStatus);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  });

  app.get('/api/leads', (req, res) => {
    res.json(db.getLeads());
  });

  app.get('/api/services', (req, res) => {
    res.json(db.getServices());
  });

  app.post('/api/services', (req, res) => {
    const serviceData = req.body;
    const services = db.getServices();
    const existingIndex = services.findIndex(s => s.id === serviceData.id);

    if (existingIndex >= 0) {
      services[existingIndex] = { ...services[existingIndex], ...serviceData };
    } else {
      services.push({
        id: serviceData.id || `SRV-${Date.now().toString().slice(-4)}`,
        name: serviceData.name || 'New Service',
        category: serviceData.category || 'General',
        price: Number(serviceData.price) || 0,
        currency: 'LKR',
        description: serviceData.description || '',
        features: Array.isArray(serviceData.features) ? serviceData.features : (serviceData.features || '').split('\n').filter(Boolean),
        deliveryTime: serviceData.deliveryTime || '3-5 Days',
        inStock: serviceData.inStock !== false
      });
    }

    db.saveServices(services);
    res.json({ success: true, services });
  });

  app.delete('/api/services/:id', (req, res) => {
    let services = db.getServices();
    services = services.filter(s => s.id !== req.params.id);
    db.saveServices(services);
    res.json({ success: true, services });
  });

  app.get('/api/chats', (req, res) => {
    const phone = req.query.phone as string | undefined;
    res.json(db.getRecentMessages(phone, 50));
  });

  app.post('/api/chats/send', async (req, res) => {
    const { phone, text } = req.body;
    if (!phone || !text) return res.status(400).json({ error: 'Phone and text are required' });

    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const remoteJid = `${cleanPhone}@s.whatsapp.net`;
      await whatsappClient.sendMessage(remoteJid, text);

      db.saveMessage({
        phone: cleanPhone,
        sender: 'human',
        content: text
      });

      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to send message' });
    }
  });

  app.get('/api/config', (req, res) => {
    res.json(config.business);
  });

  // --- WebSocket Streaming ---
  const broadcast = (data: any) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  };

  qrManager.on('qr', (data) => broadcast({ type: 'QR_UPDATE', ...data }));
  qrManager.on('connected', (data) => broadcast({ type: 'CONNECTED', ...data }));
  qrManager.on('disconnected', (data) => broadcast({ type: 'DISCONNECTED', ...data }));
  chatEvents.on('message', (data) => broadcast({ type: 'NEW_MESSAGE', ...data }));

  return { app, server };
}
