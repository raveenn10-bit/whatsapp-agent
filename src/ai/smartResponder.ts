import { config } from '../config.js';
import { db } from '../database/db.js';

export function getSmartCustomResponse(customerPhone: string, customerName: string, text: string): string | null {
  const clean = text.toLowerCase().trim();
  const bank = config.business.bankDetails;

  // 1. Greetings (Hi, Hello, Hey, Ayubowan, Vanakkam, Kohomada)
  if (
    clean === 'hi' || clean === 'hello' || clean === 'hey' || clean === 'hlo' ||
    clean === 'hy' || clean === 'hii' || clean === 'hiii' || clean === 'හායි' ||
    clean === 'හෙලෝ' || clean.includes('ayubowan') || clean.includes('ආයුබෝවන්') ||
    clean.includes('vanakkam') || clean.includes('வணக்கம்') ||
    clean.includes('kohomada') || clean.includes('good morning') || clean.includes('good evening')
  ) {
    return `*ආයුබෝවන්!* 🙏✨
*Harsh Apex Digital Solutions* වෙත සාදරයෙන් පිළිගනිමු! 🚀

අපගේ ප්‍රධාන සේවාවන්:
━━━━━━━━━━━━━━━━━
🌐 *1. Websites & E-Commerce* (රු. 15,000 සිට)
🤖 *2. 24/7 WhatsApp AI Bots* (රු. 22,000 සිට)
💻 *3. Smart Cloud POS Systems* (රු. 38,000 සිට)
📱 *4. Meta & TikTok Ads Marketing* (රු. 18,000 සිට)
🎨 *5. Logo & Graphic Design* (රු. 10,000 සිට)
━━━━━━━━━━━━━━━━━

👉 _ඔබට අවශ්‍ය සේවාවේ අංකය (උදා: *1* හෝ *2*) හෝ නම මෙතැනට එවන්න._ 😊`;
  }

  // 2. Price / Pricing / Packages / Cost / Number '1' or 'price'
  if (
    clean.includes('price') || clean.includes('pricing') || clean.includes('mila') ||
    clean.includes('gaana') || clean.includes('ganan') || clean.includes('kiyada') ||
    clean.includes('package') || clean.includes('cost') || clean.includes('rates') ||
    clean.includes('මිල') || clean.includes('ගණන්')
  ) {
    return `🔥 *HARSH APEX - PRICE LIST* 🔥
━━━━━━━━━━━━━━━━━

🌐 *Web Development:*
• *Basic Starter Web:* Rs. 15,000
• *Corporate Business Web:* Rs. 32,000
  _(Free .COM Domain + 1 Year Hosting)_
• *Full E-Commerce Store:* Rs. 55,000
  _(Payment Gateway + Card Payments)_

🤖 *WhatsApp AI Automation:*
• *24/7 Smart Sales Agent:* Rs. 22,000
  _(Sinhala/Tamil/English + Slip Scan)_

💻 *Software & POS Systems:*
• *Cloud POS & Billing System:* Rs. 38,000

📱 *Marketing & Branding:*
• *Meta/TikTok Ads Campaign:* Rs. 18,000/mo
• *Logo & Social Media Pack:* Rs. 10,000

━━━━━━━━━━━━━━━━━
📌 _නොමිලේ 1 Year Support & Maintenance හිමිවේ._

👉 *වැඩිදුර විස්තර සඳහා අවශ්‍ය සේවාවේ නම එවන්න.* 🚀`;
  }

  // 3. Website Inquiries / Number 1
  if (
    clean === '1' || clean.includes('web') || clean.includes('website') ||
    clean.includes('e-commerce') || clean.includes('ecommerce') ||
    clean.includes('online store') || clean.includes('වෙබ්')
  ) {
    return `🌐 *WEBSITE PACKAGES*
━━━━━━━━━━━━━━━━━

*1️⃣ Basic Starter Web - Rs. 15,000* 🔥
• Single Page Modern Design
• 100% Mobile Optimized
• WhatsApp Chat & Contact Form
• 3 - 4 දිනකින් Delivery

*2️⃣ Corporate Business Web - Rs. 32,000* ⭐
• Multi-Page (Home, About, Services, Contact)
• *නොමිලේ .COM/.LK Domain + 1 Year Hosting*
• Google Search SEO Ranking & Free SSL
• 5 - 7 දිනකින් Delivery

*3️⃣ Full E-Commerce Store - Rs. 55,000* 🛒
• Card Payments (Visa/Master/Koko/Bank)
• Unlimited Products & Inventory System
• Automated WhatsApp Order Alerts

━━━━━━━━━━━━━━━━━
👉 _ඔබට ගැලපෙන Package එක තෝරාගැනීමට අවශ්‍ය නම් අපට පවසන්න._ 💻✨`;
  }

  // 4. WhatsApp Bot Inquiries / Number 2
  if (
    clean === '2' || clean.includes('bot') || clean.includes('whatsapp') ||
    clean.includes('agent') || clean.includes('ai') || clean.includes('auto reply')
  ) {
    return `🤖 *24/7 WHATSAPP AI AGENT*
━━━━━━━━━━━━━━━━━
💵 *මිල: Rs. 22,000 පමණි*

ඔබ නිදාගෙන සිටින විටත් WhatsApp එකට එන පාරිභෝගිකයන්ට ක්ෂණිකව replies ලබාදෙයි! ⚡

✅ *සිංහල, Singlish, Tamil & English* භාෂා 4න්ම කතා කිරීම
✅ *Bank Slip Verification:* Customer එවනා Receipts කියවා Confirm කිරීම
✅ *Automated Orders & Leads:* විස්තර ස්වයංක්‍රීයව Save කරගැනීම
✅ *Live Web Admin Dashboard:* Chats සහ Orders බලාගැනීමට

━━━━━━━━━━━━━━━━━
👉 _ඔබේ WhatsApp එකටත් Agent කෙනෙක් හදාගැනීමට අවශ්‍ය නම් පවසන්න._ 📱🚀`;
  }

  // 5. POS System / Billing / Number 3
  if (
    clean === '3' || clean.includes('pos') || clean.includes('billing') ||
    clean.includes('inventory') || clean.includes('stock') || clean.includes('bill')
  ) {
    return `💻 *SMART CLOUD POS SYSTEM*
━━━━━━━━━━━━━━━━━
💵 *මිල: Rs. 38,000*

Shops, Supermarkets, Restaurants, Hardware සහ Pharmacies සඳහා:

✅ Barcode Scanner & Thermal Receipt Printing
✅ Real-time Stock Control & Low Stock Alerts
✅ දෛනික ආදායම්/වියදම් සහ ලාභ/අලාභ Reports
✅ WhatsApp Digital Invoices යැවීම
✅ Cloud Backup & ආරක්ෂිත පද්ධතිය

━━━━━━━━━━━━━━━━━
👉 _Demo එකක් බලාගැනීමට අවශ්‍ය නම් අපට පවසන්න._ 📊`;
  }

  // 6. Bank Details / Payment / Advance / Transfer / Slip
  if (
    clean.includes('bank') || clean.includes('account') || clean.includes('acc') ||
    clean.includes('transfer') || clean.includes('payment') || clean.includes('slip') ||
    clean.includes('salli') || clean.includes('deposit') || clean.includes('සල්ලි') ||
    clean.includes('බැංකු')
  ) {
    return `💳 *HARSH APEX - BANK DETAILS*
━━━━━━━━━━━━━━━━━

🏛️ *Bank:* ${bank.bankName} (සම්පත් බැංකුව)
👤 *Account Name:* ${bank.accountName}
🔢 *Account Number:*
\`\`\`${bank.accountNumber.replace(/\s+/g, '')}\`\`\`
📍 *Branch:* ${bank.branch}

━━━━━━━━━━━━━━━━━
📌 _Project එක ආරම්භ කිරීමට 50% Advance ගෙවිය හැක._
📸 _ගෙවූ පසු Slip පතේ ඡායාරූපයක් (Photo/Screenshot) මෙතැනට එවන්න._ ✅`;
  }

  // 7. Contact / Phone / Location / Harshan / Address
  if (
    clean.includes('contact') || clean.includes('phone') || clean.includes('number') ||
    clean.includes('call') || clean.includes('location') || clean.includes('galle') ||
    clean.includes('address') || clean.includes('harshan') || clean.includes('office')
  ) {
    return `🏢 *HARSH APEX DIGITAL SOLUTIONS*
━━━━━━━━━━━━━━━━━

👤 *Founder:* Chamilka Harshan
📞 *Hotline / WhatsApp:*
\`\`\`+94770663154\`\`\`
📧 *Email:* chamilka.ch@gmail.com
🌐 *Website:* https://harshapex.com.lk
📍 *ලිපිනය:* Pinnaduwa, Galle, Sri Lanka

━━━━━━━━━━━━━━━━━
🤝 _Harshan මහතා සමඟ සෘජුවම දුරකථනයෙන් සාකච්ඡා කිරීමට ඔබගේ දුරකථන අංකය ලබාදෙන්න._ 📞`;
  }

  // 8. Tamil Language Pricing & Inquiry
  if (
    clean.includes('விலை') || clean.includes('வணக்கம்') || clean.includes('இணையதளம்') ||
    clean.includes('விவரம்') || clean.includes('tamil')
  ) {
    return `*வணக்கம்!* 🙏✨
*Harsh Apex Digital Solutions*

எங்கள் முக்கிய சலுகைகள்:
━━━━━━━━━━━━━━━━━
🌐 *1. Basic Website:* Rs. 15,000 மட்டும் 🔥
🌐 *2. Business Website:* Rs. 32,000 (Free Domain & Hosting)
🛒 *3. E-Commerce Store:* Rs. 55,000
🤖 *4. WhatsApp AI Bot:* Rs. 22,000
💻 *5. Cloud POS System:* Rs. 38,000
━━━━━━━━━━━━━━━━━
👉 _மேலதிக விவரங்களுக்கு உங்கள் தேவையை இங்கே பதிவிடவும்._ ✨`;
  }

  return null;
}
