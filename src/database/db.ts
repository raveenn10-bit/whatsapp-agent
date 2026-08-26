import fs from 'fs';
import path from 'path';
import { config } from '../config.js';

export interface Order {
  id: string;
  customerPhone: string;
  customerName: string;
  serviceId?: string;
  serviceName: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'VERIFIED' | 'FAILED';
  slipImage?: string;
  slipDetails?: {
    bankName?: string;
    refNumber?: string;
    amount?: number;
    date?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  customerPhone: string;
  customerName: string;
  serviceInterest: string;
  language: string;
  budget?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  phone: string;
  sender: 'customer' | 'agent' | 'human';
  content: string;
  mediaType?: 'image' | 'audio' | 'document';
  mediaUrl?: string;
  timestamp: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  deliveryTime: string;
  inStock: boolean;
}

interface DatabaseSchema {
  orders: Order[];
  leads: Lead[];
  messages: ChatMessage[];
  services: ServiceItem[];
}

class Database {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor() {
    this.dbPath = path.join(config.dataDir, 'database.json');
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (fs.existsSync(this.dbPath)) {
      try {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, initializing new one:', err);
      }
    }
    const initial: DatabaseSchema = {
      orders: [],
      leads: [],
      messages: [],
      services: config.services || []
    };
    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(dataToSave?: DatabaseSchema) {
    try {
      const data = dataToSave || this.data;
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id);
  }

  public getOrdersByPhone(phone: string): Order[] {
    return this.data.orders.filter(o => o.customerPhone === phone);
  }

  public createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.orders.push(newOrder);
    this.saveDatabase();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status'], paymentStatus?: Order['paymentStatus'], slipDetails?: Order['slipDetails']): Order | null {
    const order = this.data.orders.find(o => o.id === id);
    if (!order) return null;
    order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (slipDetails) order.slipDetails = slipDetails;
    order.updatedAt = new Date().toISOString();
    this.saveDatabase();
    return order;
  }

  // --- Leads ---
  public getLeads(): Lead[] {
    return this.data.leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createOrUpdateLead(lead: { customerPhone: string; customerName: string; serviceInterest: string; language?: string; budget?: string; notes?: string }): Lead {
    let existing = this.data.leads.find(l => l.customerPhone === lead.customerPhone);
    if (existing) {
      existing.serviceInterest = lead.serviceInterest || existing.serviceInterest;
      if (lead.customerName && lead.customerName !== 'Customer') existing.customerName = lead.customerName;
      if (lead.budget) existing.budget = lead.budget;
      if (lead.notes) existing.notes = (existing.notes ? existing.notes + ' | ' : '') + lead.notes;
      existing.updatedAt = new Date().toISOString();
      this.saveDatabase();
      return existing;
    }

    const newLead: Lead = {
      id: `LEAD-${Date.now().toString().slice(-6)}`,
      customerPhone: lead.customerPhone,
      customerName: lead.customerName || 'Customer',
      serviceInterest: lead.serviceInterest,
      language: lead.language || 'Sinhala',
      budget: lead.budget,
      status: 'NEW',
      notes: lead.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.leads.push(newLead);
    this.saveDatabase();
    return newLead;
  }

  // --- Chat Messages ---
  public saveMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const newMsg: ChatMessage = {
      ...message,
      id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    this.data.messages.push(newMsg);
    // Keep max 2000 messages in storage to avoid bloated file
    if (this.data.messages.length > 2000) {
      this.data.messages = this.data.messages.slice(-1500);
    }
    this.saveDatabase();
    return newMsg;
  }

  public getRecentMessages(phone?: string, limit: number = 30): ChatMessage[] {
    let list = this.data.messages;
    if (phone) {
      list = list.filter(m => m.phone === phone);
    }
    return list.slice(-limit);
  }

  // --- Services / Catalog ---
  public getServices(): ServiceItem[] {
    return this.data.services;
  }

  public getServiceById(id: string): ServiceItem | undefined {
    return this.data.services.find(s => s.id === id || s.name.toLowerCase().includes(id.toLowerCase()));
  }

  public saveServices(services: ServiceItem[]) {
    this.data.services = services;
    this.saveDatabase();
  }
}

export const db = new Database();
