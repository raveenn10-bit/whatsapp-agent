import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load Business Config
const businessConfigPath = path.join(rootDir, 'config', 'business.json');
let businessConfig: any = {
  business: {
    name: 'Harsh Apex Digital Solutions',
    ownerName: 'K C Harshan',
    tagline: 'Elevating Your Digital presence with modern web solutions & designs. Your Trusted Digital Partner',
    description: 'Premier digital agency in Sri Lanka specializing in Web Development, WhatsApp AI Automation, Social Media Marketing, Custom Software, and Branding.',
    phone: '+94 77 066 3154',
    whatsapp: '+94 77 066 3154',
    email: 'chamilka.ch@gmail.com',
    website: 'https://harshapex.com.lk',
    facebook: 'https://facebook.com/harshapex',
    address: 'Pinnaduwa, Galle, Sri Lanka, 80000',
    openingHours: 'Always Open (24/7 AI Assistance)',
    currency: 'LKR',
    currencySymbol: 'Rs.'
  },
  bankDetails: {
    bankName: 'Sampath Bank',
    accountName: 'K C Harshan',
    accountNumber: '1141 5230 9905',
    branch: 'Karapitiya Branch',
    instructions: 'Please transfer the payment to Sampath Bank account and send a photo/screenshot of the bank slip or transfer receipt here on WhatsApp.'
  },
  languages: {
    supported: ['si', 'en', 'ta', 'singlish']
  },
  salesSettings: {
    leadNotificationNumber: '+94770663154',
    allowDirectBooking: true,
    requireDepositForProject: true,
    depositPercentage: 50,
    escalateCustomProjectToOwner: true
  }
};

if (fs.existsSync(businessConfigPath)) {
  try {
    businessConfig = JSON.parse(fs.readFileSync(businessConfigPath, 'utf-8'));
  } catch (err) {
    console.error('Error loading business.json:', err);
  }
}

// Load Services Catalog
const servicesPath = path.join(rootDir, 'config', 'services.json');
let servicesCatalog: any[] = [];
if (fs.existsSync(servicesPath)) {
  try {
    servicesCatalog = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));
  } catch (err) {
    console.error('Error loading services.json:', err);
  }
}

export const config = {
  port: parseInt(process.env.PORT || '7860', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  aiProvider: (process.env.AI_PROVIDER || 'gemini') as 'gemini' | 'openai',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  ownerPhoneNumber: process.env.OWNER_PHONE_NUMBER || '',
  autoReadMessages: process.env.AUTO_READ_MESSAGES === 'true',
  enableTypingIndicator: process.env.ENABLE_TYPING_INDICATOR !== 'false',
  googleSheetWebhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || '',
  rootDir,
  dataDir: path.join(rootDir, 'data'),
  authDir: path.join(rootDir, 'data', 'auth_info'),
  mediaDir: path.join(rootDir, 'data', 'media'),
  business: businessConfig,
  services: servicesCatalog
};

// Ensure directories exist
if (!fs.existsSync(config.dataDir)) fs.mkdirSync(config.dataDir, { recursive: true });
if (!fs.existsSync(config.mediaDir)) fs.mkdirSync(config.mediaDir, { recursive: true });
