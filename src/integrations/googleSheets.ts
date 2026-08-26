import { config } from '../config.js';
import { Order, Lead } from '../database/db.js';

export async function syncOrderToGoogleSheets(order: Order) {
  if (!config.googleSheetWebhookUrl) return;

  try {
    const payload = {
      type: 'ORDER',
      orderId: order.id,
      customerPhone: order.customerPhone,
      customerName: order.customerName,
      serviceName: order.serviceName,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      paymentStatus: order.paymentStatus,
      slipBank: order.slipDetails?.bankName || '',
      slipRef: order.slipDetails?.refNumber || '',
      notes: order.notes || '',
      createdAt: order.createdAt
    };

    await fetch(config.googleSheetWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log(`[Google Sheets Sync] Order ${order.id} sent successfully.`);
  } catch (err) {
    console.error('[Google Sheets Sync Error]:', err);
  }
}

export async function syncLeadToGoogleSheets(lead: Lead) {
  if (!config.googleSheetWebhookUrl) return;

  try {
    const payload = {
      type: 'LEAD',
      leadId: lead.id,
      customerPhone: lead.customerPhone,
      customerName: lead.customerName,
      serviceInterest: lead.serviceInterest,
      language: lead.language,
      budget: lead.budget || '',
      status: lead.status,
      notes: lead.notes || '',
      createdAt: lead.createdAt
    };

    await fetch(config.googleSheetWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    console.log(`[Google Sheets Sync] Lead ${lead.id} sent successfully.`);
  } catch (err) {
    console.error('[Google Sheets Sync Error]:', err);
  }
}
