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
🌐 _Official Website:_ https://harshapex.com.lk

_ඔබේ ව්‍යාපාරය ඩිජිටල් තාක්ෂණයෙන් ඉහළටම ඔසවා තබන ඔබේ විශ්වාසනීය ඩිජිටල් සහකරු_ ⚡

අපගේ ප්‍රධාන සේවාවන්:
━━━━━━━━━━━━━━━━━
✅ *Websites & Online Stores* (රු. 15,000 සිට) 🌐
✅ *24/7 WhatsApp AI Sales Bots* (රු. 22,000) 🤖
✅ *Custom POS & Billing Systems* (රු. 38,000) 💻
✅ *Mobile Apps (iOS & Android)* 📱
━━━━━━━━━━━━━━━━━

💬 _ඔබට අවශ්‍ය සේවාවේ අංකය පහතින් තෝරා එවන්න:_

1️⃣ *Websites & E-Commerce*
2️⃣ *WhatsApp AI Sales Bot*
3️⃣ *Custom POS Billing System*
4️⃣ *Mobile App Development*
5️⃣ *සම්පූර්ණ මිල ගණන් (Price List)*
🌐 *6. අපගේ Website එක සහ Portfolio බැලීමට*`;
  }

  // 2. Price / Pricing / Packages / Cost / Number '5'
  if (
    clean === '5' || clean.includes('price') || clean.includes('pricing') ||
    clean.includes('mila') || clean.includes('gaana') || clean.includes('ganan') ||
    clean.includes('kiyada') || clean.includes('package') || clean.includes('cost') ||
    clean.includes('rates') || clean.includes('මිල') || clean.includes('ගණන්')
  ) {
    return `🔥 *HARSH APEX - SPECIAL PRICE LIST* 🔥
🌐 https://harshapex.com.lk
━━━━━━━━━━━━━━━━━

🌐 *Web Development (Next.js 16 & SEO):*
• *Basic Starter Web:* Rs. 15,000
• *Corporate Business Web:* Rs. 32,000
  _(Free .COM Domain + 1 Year Hosting)_
• *Full E-Commerce Store:* Rs. 55,000
  _(PayHere / Card Payments + Inventory)_

🤖 *WhatsApp AI Automation:*
• *24/7 Smart Sales Agent:* Rs. 22,000
  _(Sinhala/Tamil/English + Slip Scan)_

💻 *Software & POS Systems:*
• *Cloud POS & Billing System:* Rs. 38,000
  _(Shops, Restaurants & Supermarkets)_

📱 *Mobile App Development:*
• *Custom iOS & Android App:* Rs. 48,000 සිට

━━━━━━━━━━━━━━━━━
📌 _නොමිලේ 1 Year Support & 95+ Google SEO Optimization හිමිවේ._

👉 *වැඩිදුර විස්තර සඳහා අවශ්‍ය සේවාවේ අංකය (1, 2, 3, 4) එවන්න.* 🚀`;
  }

  // 3. Website Inquiries / Number 1
  if (
    clean === '1' || clean.includes('web') || clean.includes('website') ||
    clean.includes('e-commerce') || clean.includes('ecommerce') ||
    clean.includes('online store') || clean.includes('වෙබ්')
  ) {
    return `🌐 *WEBSITE & E-COMMERCE PACKAGES*
🌐 https://harshapex.com.lk
━━━━━━━━━━━━━━━━━

*1️⃣ Basic Starter Web - Rs. 15,000* 🔥
• Single Page Modern Responsive Design
• 100% Mobile & Speed Optimized
• WhatsApp Chat & Contact Form
• 3 - 4 දිනකින් Fast Delivery

*2️⃣ Corporate Business Web - Rs. 32,000* ⭐
• Multi-Page (Home, About, Services, Contact)
• *නොමිලේ .COM/.LK Domain + 1 Year Hosting*
• Google Search #1 SEO Ranking (Next.js 16)
• 5 - 7 දිනකින් Delivery

*3️⃣ Full E-Commerce Store - Rs. 55,000* 🛒
• PayHere / Card Payments / Koko / Bank Transfer
• Unlimited Products & Inventory System
• Automated WhatsApp Order Alerts

📸 _අප කළ සාර්ථක Websites:_
- tilnogzphotography.com.lk
- NEAT Construction Services
- Hiruzone Tourism

━━━━━━━━━━━━━━━━━
👉 _ඔබට ගැලපෙන Package එක තෝරාගැනීමට අවශ්‍ය නම් අපට පවසන්න._ 💻✨`;
  }

  // 4. WhatsApp Bot Inquiries / Number 2
  if (
    clean === '2' || clean.includes('bot') || clean.includes('whatsapp') ||
    clean.includes('agent') || clean.includes('ai') || clean.includes('auto reply')
  ) {
    return `🤖 *24/7 WHATSAPP AI SALES AGENT*
━━━━━━━━━━━━━━━━━
💵 *මිල: Rs. 22,000 පමණි*

Tired of customers waiting for replies? ⚡
ඔබ නිදාගෙන සිටින විටත් WhatsApp එකට එන පාරිභෝගිකයන්ට ක්ෂණිකව replies ලබාදෙයි!

✅ *Talks in Sinhala, English, Tamil & Singlish* 🌍
✅ *Chats like a human – not a bot* 🤖
✅ *Bank Slip & Receipt Verification (Vision AI)* 📸
✅ *Keeps customer details in one place (CRM)* 📊
✅ *Takes orders & manages sales for you* 🛒
✅ *Live Web Admin Dashboard included*

━━━━━━━━━━━━━━━━━
👉 _ඔබේ WhatsApp එකටත් Agent කෙනෙක් හදාගැනීමට අවශ්‍ය නම් පවසන්න._ 📱🚀`;
  }

  // 5. POS System / Billing / Number 3
  if (
    clean === '3' || clean.includes('pos') || clean.includes('billing') ||
    clean.includes('inventory') || clean.includes('stock') || clean.includes('bill')
  ) {
    return `💻 *CUSTOM POS & CLOUD BILLING SYSTEM*
━━━━━━━━━━━━━━━━━
💵 *මිල: Rs. 38,000*

Shops, Supermarkets, Restaurants, Hardware සහ Pharmacies සඳහා:

✅ Barcode Scanner & Thermal Receipt Printing
✅ Real-time Stock Control & Low Stock Alerts
✅ දෛනික ආදායම්/වියදම් සහ ලාභ/අලාභ Reports
✅ WhatsApp Digital Invoices යැවීම
✅ Cloud Backup & ආරක්ෂිත දත්ත පද්ධතිය

━━━━━━━━━━━━━━━━━
👉 _Demo එකක් බලාගැනීමට අවශ්‍ය නම් අපට පවසන්න._ 📊`;
  }

  // 6. Mobile Apps / Number 4
  if (
    clean === '4' || clean.includes('app') || clean.includes('mobile') ||
    clean.includes('android') || clean.includes('ios') || clean.includes('flutter')
  ) {
    return `📱 *MOBILE APP DEVELOPMENT (iOS & Android)*
━━━━━━━━━━━━━━━━━
💵 *ආරම්භක මිල: Rs. 48,000 සිට*

Flutter සහ React Native නවීන තාක්ෂණයෙන් යුත් Android & iOS Mobile Applications:

✅ Super Smooth UI/UX Modern Design
✅ Real-time Cloud Database (Firebase / Node.js)
✅ Push Notifications & User Accounts
✅ Play Store & App Store Publishing Support

━━━━━━━━━━━━━━━━━
👉 _ඔබගේ App Idea එක ගැන Harshan මහතා සමඟ සාකච්ඡා කිරීමට ඔබගේ දුරකථන අංකය ලබාදෙන්න._ 🤝📱`;
  }

  // 7. Website Portfolio / Number 6
  if (
    clean === '6' || clean.includes('harshapex.com.lk') || clean.includes('site') ||
    clean.includes('portfolio') || clean.includes('work') || clean.includes('sample')
  ) {
    return `🌐 *HARSH APEX OFFICIAL WEBSITE & PORTFOLIO*
━━━━━━━━━━━━━━━━━

🔗 *Official Website:*
https://harshapex.com.lk

✨ *විශේෂත්වයන්:*
• 25+ Completed Global Projects
• 5+ Years Industry Experience
• 98% Customer Satisfaction Rate
• Modern Next.js 16, React & Cloud Serverless Tech

👉 _අපගේ වෙබ් අඩවියට පිවිස සජීවීව වැඩ (Work & Portfolio) නරඹන්න!_ 🚀`;
  }

  // 8. Bank Details / Payment / Advance / Transfer / Slip
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

  // 9. Contact / Phone / Location / Harshan / Address
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
📱 *Facebook:* https://facebook.com/harshapex
📍 *ලිපිනය:* Pinnaduwa, Galle, Sri Lanka

━━━━━━━━━━━━━━━━━
🤝 _Harshan මහතා සමඟ සෘජුවම දුරකථනයෙන් සාකච්ඡා කිරීමට ඔබගේ දුරකථන අංකය ලබාදෙන්න._ 📞`;
  }

  // 10. Tamil Language Pricing & Inquiry
  if (
    clean.includes('விலை') || clean.includes('வணக்கம்') || clean.includes('இணையதளம்') ||
    clean.includes('விவரம்') || clean.includes('tamil')
  ) {
    return `*வணக்கம்!* 🙏✨
*Harsh Apex Digital Solutions*
🌐 https://harshapex.com.lk

எங்கள் முக்கிய சலுகைகள்:
━━━━━━━━━━━━━━━━━
🌐 *1. Basic Website:* Rs. 15,000 மட்டும் 🔥
🌐 *2. Business Website:* Rs. 32,000 (Free Domain & Hosting)
🛒 *3. E-Commerce Store:* Rs. 55,000
🤖 *4. WhatsApp AI Bot:* Rs. 22,000
💻 *5. Cloud POS System:* Rs. 38,000
📱 *6. Mobile Apps:* Rs. 48,000 முதல்
━━━━━━━━━━━━━━━━━
👉 _மேலதிக விவரங்களுக்கு எண்ணை (1, 2, 3, 4) இங்கே பதிவிடவும்._ ✨`;
  }

  return null;
}
