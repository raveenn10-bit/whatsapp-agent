import { WASocket, proto, downloadMediaMessage, WAMessage } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { config } from '../config.js';
import { db } from '../database/db.js';
import { geminiService } from '../ai/gemini.js';
import { EventEmitter } from 'events';

export const chatEvents = new EventEmitter();

export async function handleIncomingMessage(sock: WASocket, msg: proto.IWebMessageInfo) {
  // Validate key
  if (!msg.key || !msg.key.remoteJid) return;
  if (msg.key.remoteJid === 'status@broadcast') return;
  if (msg.key.remoteJid.endsWith('@newsletter')) return;
  if (msg.key.fromMe) return;

  const remoteJid = msg.key.remoteJid;
  const isGroup = remoteJid.endsWith('@g.us');

  // Currently designed for 1-on-1 customer sales chats
  if (isGroup) return;

  const customerPhone = remoteJid.replace('@s.whatsapp.net', '');
  const customerName = msg.pushName || 'Valued Client';

  // Mark as read if enabled
  if (config.autoReadMessages && msg.key.id) {
    try {
      await sock.readMessages([msg.key as any]);
    } catch (_) {}
  }

  // Extract text and media
  let incomingText = '';
  let imageAttachment: { buffer: Buffer; mimeType: string } | undefined = undefined;
  let audioAttachment: { buffer: Buffer; mimeType: string } | undefined = undefined;

  const m = msg.message;
  if (!m) return;

  if (m.conversation) {
    incomingText = m.conversation;
  } else if (m.extendedTextMessage?.text) {
    incomingText = m.extendedTextMessage.text;
  } else if (m.imageMessage) {
    incomingText = m.imageMessage.caption || '';
    try {
      const buffer = await downloadMediaMessage(msg as WAMessage, 'buffer', {}) as Buffer;
      const mimeType = m.imageMessage.mimetype || 'image/jpeg';
      imageAttachment = { buffer, mimeType };

      // Save local copy
      const filename = `img_${Date.now()}_${customerPhone}.jpg`;
      const filepath = path.join(config.mediaDir, filename);
      fs.writeFileSync(filepath, buffer);
    } catch (err) {
      console.error('Failed to download image message:', err);
    }
  } else if (m.audioMessage) {
    try {
      const buffer = await downloadMediaMessage(msg as WAMessage, 'buffer', {}) as Buffer;
      const mimeType = m.audioMessage.mimetype || 'audio/ogg; codecs=opus';
      audioAttachment = { buffer, mimeType };
    } catch (err) {
      console.error('Failed to download audio message:', err);
    }
  }

  if (!incomingText && !imageAttachment && !audioAttachment) {
    // Unsupported message type (sticker, reaction, etc.)
    return;
  }

  console.log(`\n📩 [Incoming Message] From: ${customerName} (+${customerPhone})`);
  console.log(`💬 Content: "${incomingText || (imageAttachment ? '[Photo/Receipt Attachment]' : '[Voice Note]')}"`);

  // Save to DB
  db.saveMessage({
    phone: customerPhone,
    sender: 'customer',
    content: incomingText || (imageAttachment ? '[Photo/Bank Slip]' : '[Voice Note]'),
    mediaType: imageAttachment ? 'image' : audioAttachment ? 'audio' : undefined
  });

  // Emit event to live web dashboard
  chatEvents.emit('message', {
    phone: customerPhone,
    sender: 'customer',
    name: customerName,
    content: incomingText || '[Media]',
    timestamp: new Date().toISOString()
  });

  // Show "typing..." presence on WhatsApp
  if (config.enableTypingIndicator) {
    try {
      await sock.sendPresenceUpdate('composing', remoteJid);
    } catch (_) {}
  }

  // Generate AI reply via Gemini
  try {
    const aiResponse = await geminiService.generateReply(
      customerPhone,
      customerName,
      incomingText,
      imageAttachment,
      audioAttachment
    );

    // Turn off typing indicator
    if (config.enableTypingIndicator) {
      try {
        await sock.sendPresenceUpdate('paused', remoteJid);
      } catch (_) {}
    }

    if (aiResponse.text) {
      console.log(`🤖 [AI Agent Reply]:\n${aiResponse.text}`);

      // Send WhatsApp message
      await sock.sendMessage(remoteJid, {
        text: aiResponse.text
      }, { quoted: msg as WAMessage });

      // Save reply to DB
      db.saveMessage({
        phone: customerPhone,
        sender: 'agent',
        content: aiResponse.text
      });

      // Emit event to live dashboard
      chatEvents.emit('message', {
        phone: customerPhone,
        sender: 'agent',
        name: 'Harsh Apex AI',
        content: aiResponse.text,
        timestamp: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('Error generating and sending AI reply:', err);
  }
}
