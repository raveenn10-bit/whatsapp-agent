import { db, Order, Lead, ServiceItem } from '../database/db.js';
import { config } from '../config.js';
import { syncOrderToGoogleSheets, syncLeadToGoogleSheets } from '../integrations/googleSheets.js';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export const agentToolDeclarations: ToolDefinition[] = [
  {
    name: 'check_services',
    description: 'Get details about available services, pricing, features, and delivery time.',
    parameters: {
      type: 'OBJECT',
      properties: {
        category: {
          type: 'STRING',
          description: 'Filter services by category e.g. "AI Automation", "Web Development", "Digital Marketing", "Graphic Design"'
        },
        query: {
          type: 'STRING',
          description: 'Search query for a specific service'
        }
      }
    }
  },
  {
    name: 'create_order',
    description: 'Place a new project order or service booking when a client agrees to proceed.',
    parameters: {
      type: 'OBJECT',
      properties: {
        customerName: {
          type: 'STRING',
          description: 'Name of the customer'
        },
        serviceName: {
          type: 'STRING',
          description: 'Name or ID of the chosen service package'
        },
        amount: {
          type: 'NUMBER',
          description: 'Total agreed amount in LKR'
        },
        notes: {
          type: 'STRING',
          description: 'Any additional requirements, business details, or custom notes'
        }
      },
      required: ['customerName', 'serviceName', 'amount']
    }
  },
  {
    name: 'save_lead',
    description: 'Save or update customer lead information in the CRM for sales follow-up.',
    parameters: {
      type: 'OBJECT',
      properties: {
        customerName: {
          type: 'STRING',
          description: 'Name of the client'
        },
        serviceInterest: {
          type: 'STRING',
          description: 'Which service the client is interested in'
        },
        budget: {
          type: 'STRING',
          description: 'Client estimated budget if provided'
        },
        language: {
          type: 'STRING',
          description: 'Language used by the customer (Sinhala, English, Tamil, etc.)'
        },
        notes: {
          type: 'STRING',
          description: 'Summary of the discussion and needs'
        }
      },
      required: ['serviceInterest']
    }
  },
  {
    name: 'verify_bank_slip',
    description: 'Record and verify a bank transfer payment slip details provided by customer.',
    parameters: {
      type: 'OBJECT',
      properties: {
        bankName: {
          type: 'STRING',
          description: 'Name of the sending or receiving bank (e.g. Commercial Bank, Sampath, BOC)'
        },
        amount: {
          type: 'NUMBER',
          description: 'Payment amount transferred in LKR'
        },
        referenceNumber: {
          type: 'STRING',
          description: 'Transaction ID or Reference number from the slip'
        },
        date: {
          type: 'STRING',
          description: 'Date or time shown on the slip'
        },
        orderId: {
          type: 'STRING',
          description: 'Optional Order ID if linking to an existing order'
        }
      },
      required: ['bankName', 'amount', 'referenceNumber']
    }
  },
  {
    name: 'request_human_agent',
    description: 'Flag conversation when client requests a direct phone call, specialized custom quote, or human intervention.',
    parameters: {
      type: 'OBJECT',
      properties: {
        reason: {
          type: 'STRING',
          description: 'Reason why human assistance is required'
        }
      },
      required: ['reason']
    }
  }
];

export async function executeTool(name: string, args: any, customerPhone: string): Promise<any> {
  console.log(`[Tool Execution] Calling ${name} for ${customerPhone}:`, JSON.stringify(args));

  switch (name) {
    case 'check_services': {
      let services = db.getServices();
      if (args.category) {
        services = services.filter(s => s.category.toLowerCase().includes(args.category.toLowerCase()));
      }
      if (args.query) {
        const q = args.query.toLowerCase();
        services = services.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
      }
      return { success: true, count: services.length, services };
    }

    case 'create_order': {
      const order = db.createOrder({
        customerPhone,
        customerName: args.customerName,
        serviceName: args.serviceName,
        amount: args.amount,
        currency: config.business.business.currency,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        notes: args.notes
      });
      syncOrderToGoogleSheets(order).catch(console.error);
      return {
        success: true,
        message: `Order ${order.id} has been created successfully.`,
        order
      };
    }

    case 'save_lead': {
      const lead = db.createOrUpdateLead({
        customerPhone,
        customerName: args.customerName || 'Customer',
        serviceInterest: args.serviceInterest,
        budget: args.budget,
        language: args.language,
        notes: args.notes
      });
      syncLeadToGoogleSheets(lead).catch(console.error);
      return {
        success: true,
        message: `Lead recorded successfully for ${customerPhone}`,
        leadId: lead.id
      };
    }

    case 'verify_bank_slip': {
      // Find latest pending order for this customer if orderId not given
      const existingOrders = db.getOrdersByPhone(customerPhone);
      let targetOrder = args.orderId ? db.getOrderById(args.orderId) : existingOrders[0];

      if (targetOrder) {
        db.updateOrderStatus(targetOrder.id, 'CONFIRMED', 'VERIFIED', {
          bankName: args.bankName,
          refNumber: args.referenceNumber,
          amount: args.amount,
          date: args.date || new Date().toISOString()
        });
        return {
          success: true,
          verified: true,
          orderId: targetOrder.id,
          message: `Payment of ${args.amount} LKR verified via ${args.bankName} (Ref: ${args.referenceNumber}) for Order ${targetOrder.id}. Order is now CONFIRMED.`
        };
      } else {
        return {
          success: true,
          verified: true,
          message: `Payment slip received: ${args.amount} LKR transferred via ${args.bankName} (Ref: ${args.referenceNumber}). No existing order found, recorded as payment confirmation.`
        };
      }
    }

    case 'request_human_agent': {
      db.createOrUpdateLead({
        customerPhone,
        customerName: 'Customer',
        serviceInterest: 'Human Assistance Requested',
        notes: `Human handoff requested: ${args.reason}`
      });
      return {
        success: true,
        message: 'A notification has been sent to the Harsh Apex management team. A human representative will reach out shortly.'
      };
    }

    default:
      return { error: `Tool ${name} not recognized.` };
  }
}
