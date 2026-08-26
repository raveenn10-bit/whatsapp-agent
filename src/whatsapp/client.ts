import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  WASocket,
  proto
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { config } from '../config.js';
import { qrManager } from './qrManager.js';
import { handleIncomingMessage } from './messageHandler.js';

export class WhatsAppClient {
  public sock: WASocket | null = null;
  private isInitializing: boolean = false;

  public async initialize() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      console.log('🚀 Initializing WhatsApp Agent Gateway...');
      const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
      const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] as [number, number, number] }));

      this.sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Harsh Apex Digital Solutions', 'Chrome', '1.0.0'],
        syncFullHistory: false,
        generateHighQualityLinkPreview: true
      });

      // Save credentials whenever updated
      this.sock.ev.on('creds.update', saveCreds);

      // Connection lifecycle handler
      this.sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          qrManager.setQR(qr);
        }

        if (connection === 'open') {
          const userJid = this.sock?.user?.id || '';
          const phone = userJid.split(':')[0] || userJid.split('@')[0];
          qrManager.setConnected(phone);
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          const reason = (lastDisconnect?.error as Error)?.message || 'Connection closed';
          qrManager.setDisconnected(reason);

          if (shouldReconnect) {
            console.log('🔄 Reconnecting to WhatsApp in 5 seconds...');
            setTimeout(() => {
              this.isInitializing = false;
              this.initialize();
            }, 5000);
          } else {
            console.log('❌ Logged out from WhatsApp. Please delete auth files and re-scan.');
            this.isInitializing = false;
          }
        }
      });

      // Handle incoming messages
      this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
          try {
            await handleIncomingMessage(this.sock!, msg);
          } catch (err) {
            console.error('Error handling message:', err);
          }
        }
      });

    } catch (err) {
      console.error('Failed to initialize WhatsApp socket:', err);
      this.isInitializing = false;
      setTimeout(() => this.initialize(), 5000);
    }
  }

  public async sendMessage(toJid: string, text: string) {
    if (!this.sock) throw new Error('WhatsApp is not connected');
    return await this.sock.sendMessage(toJid, { text });
  }
}

export const whatsappClient = new WhatsAppClient();
