import { config } from './config.js';
import { createDashboardServer } from './dashboard/server.js';
import { whatsappClient } from './whatsapp/client.js';

const { app, server } = createDashboardServer();

// Start Web Server
server.listen(config.port, () => {
  console.log(`
==================================================================
  🚀 HARSH APEX DIGITAL SOLUTIONS - WHATSAPP AI AGENT 🚀
==================================================================
  🏢 Business: ${config.business.business.name}
  🌐 Languages: Sinhala (සිංහල), Singlish, Tamil (தமிழ்), English
  🤖 AI Model: Google Gemini (${config.geminiModel})
  📊 Web Dashboard running at: http://localhost:${config.port}
==================================================================
  `);
});

// Start WhatsApp Gateway
whatsappClient.initialize().catch((err) => {
  console.error('WhatsApp Gateway init error:', err);
});

export default app;
