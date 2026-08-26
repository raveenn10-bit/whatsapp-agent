import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  WASocket,
  Browsers
} from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { Boom } from '@hapi/boom';
import { config } from '../config.js';
import { qrManager } from './qrManager.js';
import { handleIncomingMessage } from './messageHandler.js';

export class WhatsAppClient {
  public sock: WASocket | null = null;
  private isConnecting: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  public async initialize() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      console.log('🚀 Initializing WhatsApp Agent Gateway (Persistent Mode for 0770663154)...');
      if (!fs.existsSync(config.authDir)) {
        fs.mkdirSync(config.authDir, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
      const { version } = await fetchLatestBaileysVersion().catch(() => ({
        version: [2, 3000, 1015901307] as [number, number, number]
      }));

      if (this.sock) {
        try {
          this.sock.end(undefined);
        } catch (_) {}
        this.sock = null;
      }

      this.sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: Browsers.windows('Desktop'),
        syncFullHistory: false,
        generateHighQualityLinkPreview: true,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        defaultQueryTimeoutMs: 60000,
        markOnlineOnConnect: true
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          console.log('📱 Fresh WhatsApp Pairing QR Code Generated!');
          qrManager.setQR(qr);
        }

        if (connection === 'open') {
          this.isConnecting = false;
          const userJid = this.sock?.user?.id || '';
          const phone = userJid.split(':')[0] || userJid.split('@')[0];
          console.log(`✅ WhatsApp Gateway Permanently Connected to +${phone} (0770663154)`);
          qrManager.setConnected(phone);
        }

        if (connection === 'close') {
          this.isConnecting = false;
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const isLoggedOut = statusCode === DisconnectReason.loggedOut || statusCode === 401;
          const reason = (lastDisconnect?.error as Error)?.message || `Code ${statusCode}`;

          console.warn(`⚠️ Connection closed: ${reason} (Code: ${statusCode})`);
          qrManager.setDisconnected(reason);

          if (isLoggedOut) {
            console.log('🔄 Cleaning stale session and generating fresh QR for 0770663154...');
            try {
              if (fs.existsSync(config.authDir)) {
                const files = fs.readdirSync(config.authDir);
                for (const file of files) {
                  fs.unlinkSync(path.join(config.authDir, file));
                }
              }
            } catch (err) {
              console.warn('Auth cleanup notice:', err);
            }
            this.reconnectTimer = setTimeout(() => this.initialize(), 2000);
          } else {
            console.log('🔄 Auto-reconnecting WhatsApp session in 3 seconds...');
            this.reconnectTimer = setTimeout(() => this.initialize(), 3000);
          }
        }
      });

      this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
          try {
            await handleIncomingMessage(this.sock!, msg);
          } catch (err) {
            console.error('Error handling incoming message:', err);
          }
        }
      });

    } catch (err) {
      console.error('WhatsApp socket error:', err);
      this.isConnecting = false;
      this.reconnectTimer = setTimeout(() => this.initialize(), 4000);
    }
  }

  public async sendMessage(toJid: string, text: string) {
    if (!this.sock) throw new Error('WhatsApp is not connected');
    return await this.sock.sendMessage(toJid, { text });
  }
}

export const whatsappClient = new WhatsAppClient();
