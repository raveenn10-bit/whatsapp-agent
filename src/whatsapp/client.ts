import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  WASocket,
  Browsers
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { config } from '../config.js';
import { qrManager } from './qrManager.js';
import { handleIncomingMessage } from './messageHandler.js';

export class WhatsAppClient {
  public sock: WASocket | null = null;
  private isConnecting: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;

  public async initialize() {
    if (this.isConnecting) {
      return;
    }
    this.isConnecting = true;

    // Clear any pending reconnect timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    try {
      console.log('🚀 Initializing WhatsApp Agent Gateway (High Stability Mode)...');
      const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
      const { version } = await fetchLatestBaileysVersion().catch(() => ({
        version: [2, 3000, 1015901307] as [number, number, number]
      }));

      // If an existing socket exists, gracefully end it before creating a new one
      if (this.sock) {
        try {
          this.sock.end(undefined);
        } catch (_) {}
        this.sock = null;
      }

      this.sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: Browsers.windows('Desktop'),
        syncFullHistory: false,
        generateHighQualityLinkPreview: true,
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        defaultQueryTimeoutMs: 60000,
        markOnlineOnConnect: true
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
          this.isConnecting = false;
          const userJid = this.sock?.user?.id || '';
          const phone = userJid.split(':')[0] || userJid.split('@')[0];
          console.log(`✅ WhatsApp Gateway Connected & Active for +${phone}`);
          qrManager.setConnected(phone);
        }

        if (connection === 'close') {
          this.isConnecting = false;
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          const reason = (lastDisconnect?.error as Error)?.message || `Code ${statusCode}`;

          console.warn(`⚠️ WhatsApp connection closed: ${reason} (Code: ${statusCode})`);
          qrManager.setDisconnected(reason);

          if (shouldReconnect) {
            console.log('🔄 Re-establishing stable WhatsApp connection in 3 seconds...');
            this.reconnectTimer = setTimeout(() => {
              this.initialize();
            }, 3000);
          } else {
            console.error('❌ WhatsApp logged out. Session expired. Please re-scan QR.');
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
