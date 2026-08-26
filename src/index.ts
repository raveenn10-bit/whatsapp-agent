import { config } from './config.js';
import { createDashboardServer } from './dashboard/server.js';
import { whatsappClient } from './whatsapp/client.js';

async function main() {
  console.log(`
==================================================================
  🚀 HARSH APEX DIGITAL SOLUTIONS - WHATSAPP AI AGENT 🚀
==================================================================
  🏢 Business: ${config.business.business.name}
  🌐 Languages: Sinhala (සිංහල), Singlish, Tamil (தமிழ்), English
  🤖 AI Model: Google Gemini (${config.geminiModel})
==================================================================
  `);

  // Start Web Dashboard Server
  const { server } = createDashboardServer();
  server.listen(config.port, () => {
    console.log(`📊 Web Dashboard running at: http://localhost:${config.port}`);
  });

  // Start WhatsApp Gateway
  await whatsappClient.initialize();
}

main().catch((err) => {
  console.error('Fatal error in main:', err);
  process.exit(1);
});
