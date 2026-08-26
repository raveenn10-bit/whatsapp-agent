import { config } from '../config.js';
import { db } from '../database/db.js';

export function getSmartCustomResponse(customerPhone: string, customerName: string, text: string): string | null {
  const clean = text.toLowerCase().trim();
  const b = config.business.business;
  const bank = config.business.bankDetails;

  // 1. Greetings (Hi, Hello, Hey, Ayubowan, Vanakkam, Kohomada)
  if (
    clean === 'hi' || clean === 'hello' || clean === 'hey' || clean === 'hlo' ||
    clean === 'hy' || clean === 'hii' || clean === 'hiii' || clean === 'හායි' ||
    clean === 'හෙලෝ' || clean.includes('ayubowan') || clean.includes('ආයුබෝවන්') ||
    clean.includes('vanakkam') || clean.includes('வணக்கம்') ||
    clean.includes('kohomada') || clean.includes('good morning') || clean.includes('good evening')
  ) {
    return `ආයුබෝවන්! 🙏✨
**Harsh Apex Digital Solutions** වෙත ඔබව සාදරයෙන් පිළිගනිමු! 🚀

අපි ඕනෑම Budget එකකට ගැලපෙන ලෙස ඉතා සාධාරණ මිල ගණන් යටතේ උසස්ම ඩිජිටල් සේවාවන් සපයන්නෙමු:

🌐 **1. Websites & E-Commerce** (ආරම්භක මිල **රු. 15,000 සිට**)
🤖 **2. 24/7 WhatsApp AI Sales Bots** (**රු. 22,000 සිට**)
💻 **3. Smart Cloud POS & Billing Systems** (**රු. 38,000 සිට**)
📱 **4. Meta & TikTok Ads / Marketing** (**රු. 18,000 සිට**)
🎨 **5. Logo & Graphic Design** (**රු. 10,000 සිට**)

ඔබට අවශ්‍ය සේවාව කුමක්ද? මිල ගණන් සහ විස්තර ලබාගැනීමට පවසන්න! 😊`;
  }

  // 2. Price / Pricing / Packages / Cost / Kohomada Mila
  if (
    clean.includes('price') || clean.includes('pricing') || clean.includes('mila') ||
    clean.includes('gaana') || clean.includes('ganan') || clean.includes('kiyada') ||
    clean.includes('package') || clean.includes('cost') || clean.includes('rates') ||
    clean.includes('මිල') || clean.includes('ගණන්')
  ) {
    return `🔥 **Harsh Apex Digital Solutions - Budget-Friendly Price List:** 🔥

🌐 **Website Development Packages:**
   * 🔹 **Starter / Basic Website:** **Rs. 15,000** *(Single Page / Mobile Optimized / Fast Delivery)*
   * 🔹 **Corporate Business Website:** **Rs. 32,000** *(Multi-page + Free .COM Domain & 1 Year Hosting + SEO)*
   * 🔹 **Full E-Commerce Store:** **Rs. 55,000** *(Payment Gateways + Unlimited Products + WhatsApp Alerts)*

🤖 **WhatsApp AI Automation & Bots:**
   * 🔹 **24/7 Smart Sales & Support Bot:** **Rs. 22,000** *(Sinhala/Tamil/English + Bank Slip Verification)*

💻 **Software & POS Systems:**
   * 🔹 **Cloud POS & Billing System:** **Rs. 38,000** *(Barcode billing, Stock control, WhatsApp Invoices)*

📱 **Marketing & Branding:**
   * 🔹 **Social Media Meta Ads Campaign:** **Rs. 18,000/mo**
   * 🔹 **Logo & Social Media Branding Pack:** **Rs. 10,000**

📌 *සියලුම Packages සඳහා නොමිලේ 1 Year Support & Consultation හිමිවේ.*

ඔබට ගැලපෙන Package එක තෝරාගැනීමට අවශ්‍ය නම් අපට පවසන්න! 🚀`;
  }

  // 3. Website / Web Design / E-Commerce
  if (
    clean.includes('web') || clean.includes('website') || clean.includes('e-commerce') ||
    clean.includes('ecommerce') || clean.includes('online store') || clean.includes('වෙබ්')
  ) {
    return `🌐 **Harsh Apex Website Designing Packages:**

අපි ඔබගේ අවශ්‍යතාවය සහ Budget එක අනුව Packages 3ක් යටතේ Websites නිර්මාණය කර දෙන්නෙමු:

1️⃣ **Basic Starter Website - Rs. 15,000 පමණි** 🔥
   * Single Page Modern Responsive Design
   * Mobile & Tablet 100% Optimized
   * WhatsApp Chat Button, Contact Form & Google Maps
   * සුළු ව්‍යාපාර, Portfolio සහ Services සඳහා වඩාත් සුදුසුයි
   * 3 - 4 දිනකින් Delivery!

2️⃣ **Corporate Business Website - Rs. 32,000**
   * Multi-Page (Home, About, Services, Gallery, Contact)
   * **නොමිලේ .COM / .LK Domain & 1 Year High-Speed Cloud Hosting**
   * Google Search SEO Ranking & Free SSL
   * 5 - 7 දිනකින් Delivery

3️⃣ **Full E-Commerce Online Store - Rs. 55,000**
   * Online Card Payments (Visa/MasterCard/Koko/Bank)
   * Unlimited Products, Shopping Cart & Inventory
   * Automated WhatsApp & Email Order Confirmations

ඔබේ ව්‍යාපාරයට ගැලපෙන Package එක කුමක්දැයි අපට පවසන්න! 💻✨`;
  }

  // 4. WhatsApp Bot / AI Assistant
  if (
    clean.includes('bot') || clean.includes('whatsapp') || clean.includes('agent') ||
    clean.includes('ai') || clean.includes('auto reply')
  ) {
    return `🤖 **Harsh Apex 24/7 AI WhatsApp Sales Agent (Rs. 22,000)**

ඔබ නිදාගෙන සිටින වේලාවටත් WhatsApp එකට එන Clients ලාට ක්ෂණිකව replies ලබාදෙන Smart AI Agent කෙනෙක්! ⚡

✅ **Trilingual Chat:** සිංහල, Singlish, Tamil (தமிழ்) & English චතුර ලෙස කතා කරයි
✅ **Bank Slip Verification:** Customer එවනා Bank Transfer Slips / Screenshots කියවා Confirm කරයි
✅ **Automated Orders & CRM:** Customer Details ස්වයංක්‍රීයව Save කරගනී
✅ **Live Web Admin Panel:** Orders සහ Chat Logs බලාගැනීමට Dashboard එකක් හිමිවේ

ඔබේ WhatsApp එකටත් මේ Bot කෙනෙක් Set කරගැනීමට අවශ්‍ය නම් පවසන්න! 📱🚀`;
  }

  // 5. POS System / Billing / Retail / Supermarket / Restaurant
  if (
    clean.includes('pos') || clean.includes('billing') || clean.includes('inventory') ||
    clean.includes('stock') || clean.includes('bill')
  ) {
    return `💻 **Smart Cloud POS & Billing System - Rs. 38,000**

Shops, Supermarkets, Restaurants, Hardware සහ Pharmacies සඳහා විශේෂිත වූ POS පද්ධතිය:

✅ Barcode Scanner සහ Thermal Receipt Printing Support
✅ Real-time Stock / Inventory Tracking & Low Stock Alerts
✅ දෛනික ආදායම්, වියදම් සහ ලාභ/අලාභ වාර්තා (Daily P&L Reports)
✅ පාරිභෝගිකයාගේ WhatsApp එකට කෙලින්ම Digital Invoices යැවීම
✅ Cloud Backup සහ ආරක්ෂිත දත්ත පද්ධතිය

Demo එකක් බලාගැනීමට අවශ්‍ය නම් අපට පවසන්න! 📊`;
  }

  // 6. Bank Details / Payment / Advance / Transfer / Slip / Salli
  if (
    clean.includes('bank') || clean.includes('account') || clean.includes('acc') ||
    clean.includes('transfer') || clean.includes('payment') || clean.includes('slip') ||
    clean.includes('salli') || clean.includes('deposit') || clean.includes('සල්ලි') ||
    clean.includes('බැංකු')
  ) {
    return `💳 **Harsh Apex Digital Solutions - නිල ගෙවීම් බැංකු ගිණුම් විස්තර:**

🏛️ **Bank:** ${bank.bankName} (සම්පත් බැංකුව)
👤 **Account Name:** ${bank.accountName}
🔢 **Account Number:** **${bank.accountNumber}**
📍 **Branch:** ${bank.branch}

📌 *Project එක ආරම්භ කිරීමට 50% Advance මුදල තැන්පත් කළ හැක. මුදල් ගෙවූ පසු Slip පතේ ඡායාරූපය (Photo/Screenshot) මෙතැනට WhatsApp කරන්න. පද්ධතිය මගින් එය ක්ෂණිකව Confirm කරනු ඇත.* ✅`;
  }

  // 7. Contact / Phone / Location / Harshan / Address
  if (
    clean.includes('contact') || clean.includes('phone') || clean.includes('number') ||
    clean.includes('call') || clean.includes('location') || clean.includes('galle') ||
    clean.includes('address') || clean.includes('harshan') || clean.includes('office')
  ) {
    return `🏢 **Harsh Apex Digital Solutions - සම්බන්ධතා විස්තර:**

👤 **Founder & Lead Consultant:** Chamilka Harshan
📞 **Hotline / WhatsApp:** +94 77 066 3154
📧 **Email:** chamilka.ch@gmail.com
🌐 **Website:** https://harshapex.com.lk
📱 **Facebook:** https://facebook.com/harshapex
📍 **ලිපිනය:** Pinnaduwa, Galle, Sri Lanka

ඔබට Harshan මහතා සමඟ සෘජුවම දුරකථනයෙන් සාකච්ඡා කිරීමට අවශ්‍ය නම් ඔබේ දුරකථන අංකය ලබාදෙන්න! 🤝📞`;
  }

  // 8. Tamil Language Pricing & Inquiry
  if (
    clean.includes('விலை') || clean.includes('வணக்கம்') || clean.includes('இணையதளம்') ||
    clean.includes('விவரம்') || clean.includes('tamil')
  ) {
    return `வணக்கம்! 🙏✨
**Harsh Apex Digital Solutions**-ன் பிரத்யேக சலுகைகள்:

🌐 **1. Basic Website:** **Rs. 15,000 மட்டும்** 🔥
🌐 **2. Corporate Business Website:** **Rs. 32,000** (Free Domain & Hosting உடன்)
🛒 **3. Full E-Commerce Store:** **Rs. 55,000**
🤖 **4. 24/7 WhatsApp AI Bot:** **Rs. 22,000**
💻 **5. Cloud POS & Billing System:** **Rs. 38,000**

மேலதிக விவரங்களுக்கு உங்கள் தேவையை இங்கே பதிவிடவும். ✨`;
  }

  return null;
}
