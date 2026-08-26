import { db, ChatMessage } from '../database/db.js';

export interface ConversationTurn {
  role: 'user' | 'model' | 'assistant' | 'system';
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
}

export class MemoryManager {
  private sessions: Map<string, Array<{ role: 'user' | 'model'; content: string }>> = new Map();
  private maxHistory: number = 16;

  public getHistory(phone: string): Array<{ role: 'user' | 'model'; content: string }> {
    if (!this.sessions.has(phone)) {
      // Hydrate from DB
      const recent = db.getRecentMessages(phone, this.maxHistory);
      const history: Array<{ role: 'user' | 'model'; content: string }> = [];
      for (const msg of recent) {
        history.push({
          role: msg.sender === 'customer' ? 'user' : 'model',
          content: msg.content
        });
      }
      this.sessions.set(phone, history);
    }
    return this.sessions.get(phone) || [];
  }

  public addMessage(phone: string, role: 'user' | 'model', content: string) {
    const history = this.getHistory(phone);
    history.push({ role, content });
    if (history.length > this.maxHistory) {
      history.splice(0, history.length - this.maxHistory);
    }
    this.sessions.set(phone, history);
  }

  public clearSession(phone: string) {
    this.sessions.delete(phone);
  }
}

export const memoryManager = new MemoryManager();
