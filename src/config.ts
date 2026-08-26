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
let businessConfig = {
  business: {
    name: 'Harsh Apex Digital Solutions',
    tagline: 'Empowering Businesses with Next-Gen Digital & AI Solutions',
    description: 'Premier digital agency in Sri Lanka specializing in Web Development, WhatsApp AI Automation, Social Media Marketing, Custom Software, and Branding.',
    phone: '+94 7X XXX XXXX',
    email: 'contact@harshapex.com',
    website: 'https://harshapex.com',
    address: 'Colombo, Sri Lanka',
    openingHours: '24/7 AI Assistance',
    currency: 'LKR',
    currencySymbol: 'Rs.'
  },
  bankDetails: {
    bankName: 'Commercial Bank of Ceylon',
    accountName: 'Harsh Apex Digital Solutions',
    accountNumber: '1000XXXXXX',
    branch: 'Colombo Main Branch',
    instructions: 'Please transfer the payment and send a photo/screenshot of the bank slip or transfer receipt here on WhatsApp.'
  },
  languages: {
    supported: ['si', 'en', 'ta', 'singlish']
  },
  salesSettings: {
    leadNotificationNumber: '+947XXXXXXXX',
    allowDirectBooking: true,
    requireDepositForProject: true,
    depositPercentage: 50
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
  port: parseInt(process.env.PORT || '3000', 10),
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
