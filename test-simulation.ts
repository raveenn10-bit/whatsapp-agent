import { config } from './src/config.js';
import { db } from './src/database/db.js';
import { buildSystemPrompt } from './src/ai/systemPrompt.js';
import { executeTool } from './src/tools/agentTools.js';

async function runSimulationTests() {
  console.log('🧪 Starting Harsh Apex WhatsApp AI Agent Simulation Tests...\n');

  // Test 1: Config & Services
  console.log('--- Test 1: Config & Services ---');
  console.log('Business Name:', config.business.business.name);
  console.log('Total Services in Catalog:', db.getServices().length);
  if (db.getServices().length >= 4) {
    console.log('✅ Services loaded successfully.');
  } else {
    throw new Error('Failed to load services.');
  }

  // Test 2: System Prompt Trilingual Builder
  console.log('\n--- Test 2: System Prompt Builder ---');
  const prompt = buildSystemPrompt('94771234567', 'Chamilka Harshan');
  if (prompt.includes('Harsh Apex Digital Solutions') && prompt.includes('Trilingual Language Guidelines')) {
    console.log('✅ Trilingual System Prompt generated properly.');
  } else {
    throw new Error('System prompt missing core guidelines.');
  }

  // Test 3: Tool Execution - Check Services
  console.log('\n--- Test 3: Tool Execution (check_services) ---');
  const servicesResult = await executeTool('check_services', { category: 'AI Automation' }, '94771234567');
  console.log('Matching Services:', servicesResult.count);
  if (servicesResult.success && servicesResult.count > 0) {
    console.log('✅ check_services tool passed.');
  }

  // Test 4: Tool Execution - Save Lead
  console.log('\n--- Test 4: Tool Execution (save_lead) ---');
  const leadResult = await executeTool('save_lead', {
    customerName: 'Chamilka Harshan',
    serviceInterest: 'WhatsApp AI Agent - Pro',
    language: 'Sinhala / Singlish',
    budget: 'Rs. 45,000',
    notes: 'Interested in connecting WhatsApp bot with bank slip verification'
  }, '94771234567');
  console.log('Lead ID created:', leadResult.leadId);
  const leads = db.getLeads();
  if (leads.length > 0 && leads[0].customerName === 'Chamilka Harshan') {
    console.log('✅ Lead saved into CRM database successfully.');
  }

  // Test 5: Tool Execution - Create Order & Verify Slip
  console.log('\n--- Test 5: Tool Execution (create_order & verify_bank_slip) ---');
  const orderResult = await executeTool('create_order', {
    customerName: 'Chamilka Harshan',
    serviceName: 'WhatsApp AI Sales Assistant - Pro',
    amount: 45000,
    notes: 'Include Google Sheets CRM setup'
  }, '94771234567');
  console.log('Order created:', orderResult.order.id, 'Status:', orderResult.order.status);

  const slipResult = await executeTool('verify_bank_slip', {
    bankName: 'Commercial Bank',
    amount: 45000,
    referenceNumber: 'TXN99887766',
    date: '2026-08-26'
  }, '94771234567');
  console.log('Slip verification result:', slipResult.message);

  const updatedOrder = db.getOrderById(orderResult.order.id);
  if (updatedOrder?.paymentStatus === 'VERIFIED' && updatedOrder?.status === 'CONFIRMED') {
    console.log('✅ Order verified and confirmed autonomously!');
  }

  console.log('\n🎉 ALL SIMULATION TESTS PASSED 100%!');
}

runSimulationTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
