import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import { EventEmitter } from 'events';

class QRManager extends EventEmitter {
  private currentQR: string | null = null;
  private currentQRDataUrl: string | null = null;
  private isConnected: boolean = false;
  private userPhoneNumber: string | null = null;

  public async setQR(qrString: string) {
    this.currentQR = qrString;
    this.isConnected = false;

    try {
      this.currentQRDataUrl = await qrcode.toDataURL(qrString, { margin: 2, scale: 8 });
    } catch (err) {
      console.error('Failed to generate QR Data URL:', err);
    }

    console.log('\n======================================================');
    console.log('📲 SCAN THIS QR CODE ON YOUR WHATSAPP MOBILE APP:');
    console.log('(WhatsApp > Settings > Linked Devices > Link a Device)');
    console.log('======================================================\n');
    qrcodeTerminal.generate(qrString, { small: true });

    this.emit('qr', { qr: qrString, dataUrl: this.currentQRDataUrl });
  }

  public setConnected(phoneNumber?: string) {
    this.currentQR = null;
    this.currentQRDataUrl = null;
    this.isConnected = true;
    this.userPhoneNumber = phoneNumber || null;
    console.log('✅ WhatsApp Linked & Ready! Active number:', phoneNumber || 'Connected');
    this.emit('connected', { phoneNumber });
  }

  public setDisconnected(reason?: string) {
    this.isConnected = false;
    this.currentQR = null;
    this.currentQRDataUrl = null;
    console.log('⚠️ WhatsApp Disconnected:', reason || 'Unknown');
    this.emit('disconnected', { reason });
  }

  public getStatus() {
    return {
      connected: this.isConnected,
      phoneNumber: this.userPhoneNumber,
      hasQR: !!this.currentQRDataUrl,
      qrDataUrl: this.currentQRDataUrl
    };
  }
}

export const qrManager = new QRManager();
