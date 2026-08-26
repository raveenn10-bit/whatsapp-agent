import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { config } from '../config.js';
import { buildSystemPrompt } from './systemPrompt.js';
import { memoryManager } from './memory.js';
import { executeTool } from '../tools/agentTools.js';

export interface AIResponse {
  text: string;
  toolCallsMade?: string[];
  suggestedAction?: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    if (config.geminiApiKey && config.geminiApiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    }
  }

  public isConfigured(): boolean {
    return !!(config.geminiApiKey && config.geminiApiKey !== 'YOUR_GEMINI_API_KEY_HERE');
  }

  public updateApiKey(key: string) {
    config.geminiApiKey = key;
    this.genAI = new GoogleGenerativeAI(key);
  }

  public async generateReply(
    customerPhone: string,
    customerName: string,
    incomingText: string,
    imageAttachment?: { buffer: Buffer; mimeType: string },
    audioAttachment?: { buffer: Buffer; mimeType: string }
  ): Promise<AIResponse> {
    if (!this.genAI) {
      if (config.geminiApiKey && config.geminiApiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
      } else {
        return {
          text: `ආයුබෝවන්! Harsh Apex Digital Solutions වෙත සාදරයෙන් පිළිගනිමු.\n\n⚠️ (System Notice: Gemini API Key is not set in .env yet. Please add your GEMINI_API_KEY to activate 24/7 AI Sales Assistant).`
        };
      }
    }

    const systemInstruction = buildSystemPrompt(customerPhone, customerName);
    const history = memoryManager.getHistory(customerPhone);

    // Tools definition for Gemini
    const tools: any[] = [
      {
        functionDeclarations: [
          {
            name: 'check_services',
            description: 'Get details about available services, pricing, features, and delivery time.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                category: { type: SchemaType.STRING, description: 'Service category' },
                query: { type: SchemaType.STRING, description: 'Search term' }
              }
            }
          },
          {
            name: 'create_order',
            description: 'Place a new project order or service booking when a client agrees to proceed.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                customerName: { type: SchemaType.STRING, description: 'Name of the customer' },
                serviceName: { type: SchemaType.STRING, description: 'Name of service package' },
                amount: { type: SchemaType.NUMBER, description: 'Agreed price in LKR' },
                notes: { type: SchemaType.STRING, description: 'Project notes or custom requirements' }
              },
              required: ['customerName', 'serviceName', 'amount']
            }
          },
          {
            name: 'save_lead',
            description: 'Save or update customer lead information in the CRM.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                customerName: { type: SchemaType.STRING, description: 'Name of the client' },
                serviceInterest: { type: SchemaType.STRING, description: 'Service interested in' },
                budget: { type: SchemaType.STRING, description: 'Budget if mentioned' },
                language: { type: SchemaType.STRING, description: 'Language of customer' },
                notes: { type: SchemaType.STRING, description: 'Discussion notes' }
              },
              required: ['serviceInterest']
            }
          },
          {
            name: 'verify_bank_slip',
            description: 'Record and verify a bank transfer payment slip details from receipt image.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                bankName: { type: SchemaType.STRING, description: 'Bank Name on slip' },
                amount: { type: SchemaType.NUMBER, description: 'Transferred amount in LKR' },
                referenceNumber: { type: SchemaType.STRING, description: 'Reference / Trans ID' },
                date: { type: SchemaType.STRING, description: 'Date of transaction' },
                orderId: { type: SchemaType.STRING, description: 'Order ID if known' }
              },
              required: ['bankName', 'amount', 'referenceNumber']
            }
          },
          {
            name: 'request_human_agent',
            description: 'Flag conversation when client requests a direct phone call or human agent.',
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                reason: { type: SchemaType.STRING, description: 'Reason for human handoff' }
              },
              required: ['reason']
            }
          }
        ]
      }
    ];

    try {
      const model = this.genAI.getGenerativeModel({
        model: config.geminiModel,
        systemInstruction,
        tools
      });

      // Prepare contents
      const contents: any[] = [];

      // Add prior history
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }

      // Add current turn parts
      const currentParts: any[] = [];
      if (incomingText) {
        currentParts.push({ text: incomingText });
      }

      // Add Image attachment if present (Bank slip or product photo)
      if (imageAttachment) {
        currentParts.push({
          inlineData: {
            mimeType: imageAttachment.mimeType,
            data: imageAttachment.buffer.toString('base64')
          }
        });
        if (!incomingText) {
          currentParts.push({ text: 'Customer sent an image (possibly a bank transfer slip or inquiry photo). Please analyze it and reply appropriately.' });
        }
      }

      // Add Audio attachment if present (Voice Note)
      if (audioAttachment) {
        currentParts.push({
          inlineData: {
            mimeType: audioAttachment.mimeType,
            data: audioAttachment.buffer.toString('base64')
          }
        });
        if (!incomingText) {
          currentParts.push({ text: 'Customer sent a voice message. Please listen, understand the language (Sinhala/Tamil/English), and respond appropriately.' });
        }
      }

      contents.push({
        role: 'user',
        parts: currentParts
      });

      const toolCallsMade: string[] = [];

      // Run generation
      let result = await model.generateContent({ contents });
      let response = result.response;
      let functionCalls = response.functionCalls();

      // Handle function calling loop
      let iterations = 0;
      while (functionCalls && functionCalls.length > 0 && iterations < 4) {
        iterations++;
        const functionResponses: any[] = [];

        for (const call of functionCalls) {
          toolCallsMade.push(call.name);
          const toolResult = await executeTool(call.name, call.args, customerPhone);
          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: toolResult
            }
          });
        }

        // Send tool results back to Gemini for final response
        contents.push({
          role: 'model',
          parts: response.candidates?.[0]?.content?.parts || []
        });

        contents.push({
          role: 'user',
          parts: functionResponses
        });

        result = await model.generateContent({ contents });
        response = result.response;
        functionCalls = response.functionCalls();
      }

      const replyText = response.text() || 'Thank you for reaching out to Harsh Apex Digital Solutions! We are processing your request.';

      // Save to memory
      memoryManager.addMessage(customerPhone, 'user', incomingText || '[Media/Voice Message]');
      memoryManager.addMessage(customerPhone, 'model', replyText);

      return {
        text: replyText,
        toolCallsMade
      };
    } catch (err: any) {
      console.error('[Gemini AI Error]:', err);
      return {
        text: `ස්තූතියි අප හා සම්බන්ධ වීම ගැන! Harsh Apex Digital Solutions නියෝජිතයෙක් ඉක්මනින්ම ඔබ හා සම්බන්ධ වනු ඇත. 😊\n\n(AI Assistant is currently reconnecting).`
      };
    }
  }
}

export const geminiService = new GeminiService();
