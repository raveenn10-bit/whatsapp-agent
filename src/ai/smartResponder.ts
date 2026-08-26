import { config } from '../config.js';
import { db } from '../database/db.js';

export function getSmartCustomResponse(customerPhone: string, customerName: string, text: string): string | null {
  const clean = text.toLowerCase().trim();
  const b = config.business.business;
  const bank = config.business.bankDetails;
  const services = db.getServices();

  // 1. Greetings (Hi, Hello, Hey, Ayubowan, Vanakkam, Kohomada, Haai)
  if (
    clean === 'hi' || clean === 'hello' || clean === 'hey' || clean === 'hlo' ||
    clean === 'hy' || clean === 'hii' || clean === 'hiii' || clean === 'හායි' ||
    clean === 'හෙලෝ' || clean.includes('ayubowan') || clean.includes('ආයුබෝවන්') ||
    clean.includes('vanakkam') || clean.includes('வணக்கம்') ||
    clean.includes('kohomada') || clean.includes('good morning') || clean.includes('good evening')
  ) {
    return `ආයුබෝවන්! 🙏✨
**Harsh Apex Digital Solutions** වෙත ඔබව සාදරයෙන් පිළිගනිමු! 🚀

අපි ඔබගේ ව්‍යාපාරය ඩිජිටල් තාක්ෂණයෙන් ඉහළටම ඔසවා තැබීමට පහත සේවාවන් සපයන්නෙමු:

🌐 **1. Website Designing & Development** (Next.js & WordPress නවීන වෙබ් අඩවි)
🛒 **2. E-Commerce Online Stores** (Card Payments & Online Ordering සහිතව)
🤖 **3. 24/7 WhatsApp AI Sales Agents & Bots** (සිංහල / දෙමළ / English)
💻 **4. Smart Cloud POS & Billing Systems** (Shops & Restaurants සඳහා)
📱 **5. Mobile App Development** (iOS & Android Apps)
🎨 **6. UI/UX, Logo & Social Media Marketing**

ඔබට අවශ්‍ය සේවාව හෝ මිල ගණන් (Price List) දැනගැනීමට අවශ්‍ය නම් පවසන්න! 😊`;
  }

  // 2. Price / Pricing / Packages / Cost / Kohomada Mila
  if (
    clean.includes('price') || clean.includes('pricing') || clean.includes('mila') ||
    clean.includes('gaana') || clean.includes('ganan') || clean.includes('kiyada') ||
    clean.includes('package') || clean.includes('cost') || clean.includes('rates') ||
    clean.includes('මිල') || clean.includes('ගණන්')
  ) {
    return `🔥 **Harsh Apex Digital Solutions - නිල සේවා සහ මිල ගණන් (Official Price List):** 🔥

🌐 **1. Corporate Business Website**
   💵 ආරම්භක මිල: **Rs. 35,000**
   * Free .COM / .LK Domain & High-Speed Hosting (1 Year)
   * 100% Mobile & SEO Optimized | 5–7 දිනකින් Delivery

🛒 **2. Full E-Commerce Online Store**
   💵 ආරම්භක මිල: **Rs. 60,000**
   * Online Payment Gateway (Visa/Master/Koko/Bank)
   * Unlimited Products & Order Management System

🤖 **3. 24/7 WhatsApp AI Sales Agent**
   💵 ආරම්භක මිල: **Rs. 25,000**
   * සිංහල, Singlish, Tamil & English භාෂා 4න්ම කතා කිරීම
   * Bank Slip / Receipt Verification & Live Web Dashboard

💻 **4. Smart Cloud POS & Billing System**
   💵 ආරම්භක මිල: **Rs. 45,000**
   * Barcode Billing, Stock Control & WhatsApp Invoices

📱 **5. Social Media Marketing & Meta Ads**
   💵 මාසිකව: **Rs. 25,000**
   * Targeted Facebook, Instagram & TikTok Ad Campaigns

🎨 **6. Branding & Logo Design Pack**
   💵 මිල: **Rs. 15,000**
   * Premium Logo + 15 Graphic Post Designs

📌 *සෑම සේවාවක් සඳහාම නොමිලේ Maintenance & Support හිමිවේ.*

ඔබේ ව්‍යාපාරයට වඩාත්ම ගැලපෙන සේවාව කුමක්ද? වැඩිදුර විස්තර සඳහා පවසන්න! 🚀`;
  }

  // 3. Website / Web Design / Development / Nextjs / WordPress
  if (
    clean.includes('web') || clean.includes('website') || clean.includes('e-commerce') ||
    clean.includes('ecommerce') || clean.includes('online store') || clean.includes('වෙබ්')
  ) {
    return `🌐 **Harsh Apex Website Development Services:**

අපි ලොව නවීනතම **Next.js 16, React & Tailwind CSS** තාක්ෂණයෙන් Google හි #1 Rank වන, සුපිරි වේගවත් වෙබ් අඩවි නිර්මාණය කර දෙන්නෙමු:

🔹 **Business Corporate Website (Rs. 35,000):**
   * Single & Multi-page modern designs
   * Free 1 Year Domain & Cloud Server Hosting
   * WhatsApp Direct Chat, Inquiry Forms & SEO

🔹 **Full E-Commerce Platform (Rs. 60,000):**
   * PayHere, Stripe, Visa/MasterCard, Koko Pay & COD
   * Automated WhatsApp & Email Order Confirmation
   * Admin Control Panel to manage products and sales

📸 *අප විසින් නිර්මාණය කළ සාර්ථක Websites කිහිපයක්:*
- Photography Studios (e.g. tilnogzphotography.com.lk)
- Construction & Hospitality (e.g. NEAT Services)
- Tourism & Hotels (e.g. Hiruzone Tourism)
- Fashion Boutiques & Retail Stores

ඔබගේ ව්‍යාපාරයටත් Website එකක් සාදාගැනීමට අවශ්‍ය නම් විස්තර පවසන්න! 💻✨`;
  }

  // 4. WhatsApp Bot / AI Assistant
  if (
    clean.includes('bot') || clean.includes('whatsapp') || clean.includes('agent') ||
    clean.includes('ai') || clean.includes('auto reply')
  ) {
    return `🤖 **Harsh Apex 24/7 AI WhatsApp Sales Agent (Rs. 25,000)**

ඔබ නිදාගෙන සිටින විටත් ව්‍යාපාරයේ WhatsApp එකට එන Clients ලාට විනාඩියෙන් replies දෙන Intelligent AI Sales Agent කෙනෙක්! ⚡

✅ **Trilingual:** සිංහල, Singlish, දෙමළ (தமிழ்) සහ English චතුර ලෙස කතා කරයි
✅ **Bank Slip Verification:** Customer එවනා Bank Deposit Slips/Screenshots කියවා Amount එක සහ Ref No එක Confirm කරයි
✅ **Order & Lead Capturing:** Customer details, Orders ස්වයංක්‍රීයව Database සහ Google Sheets වලට Save කරයි
✅ **Live Web Admin Panel:** ඔබගේ Browser එකෙන් Orders සහ Live Chats බලාගත හැක

ඔබේ WhatsApp අංකයටත් මෙවැනි Smart Agent කෙනෙක් සම්බන්ධ කරගැනීමට අවශ්‍යද? 📱🚀`;
  }

  // 5. POS System / Billing / Retail / Supermarket / Restaurant
  if (
    clean.includes('pos') || clean.includes('billing') || clean.includes('inventory') ||
    clean.includes('stock') || clean.includes('bill')
  ) {
    return `💻 **Smart Cloud POS & Billing Software - Rs. 45,000**

Retail Shops, Supermarkets, Restaurants, Hardware සහ Pharmacies සඳහා විශේෂිත වූ POS පද්ධතිය:

✅ Barcode Scanner සහ Thermal Receipt Printing Support
✅ Real-time Stock / Inventory Tracking & Low Stock Alerts
✅ දෛනික ආදායම්, වියදම් සහ ලාභ/අලාභ වාර්තා (Daily P&L Reports)
✅ පාරිභෝගිකයාගේ WhatsApp එකට කෙලින්ම Digital Invoices යැවීම
✅ Multi-Branch (ශාඛා කිහිපයක්) කළමනාකරණය & Cloud Backup

Demo එකක් බලාගැනීමට හෝ වැඩිදුර විස්තර සඳහා පවසන්න! 📊`;
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

📌 *Project එක ආරම්භ කිරීමට 50% Advance හෝ සම්පූර්ණ මුදල තැන්පත් කළ හැක. මුදල් ගෙවූ පසු Slip පතේ ඡායාරූපය (Photo/Screenshot) මෙතැනට WhatsApp කරන්න. පද්ධතිය මගින් එය ක්ෂණිකව තහවුරු කරනු ඇත.* ✅`;
  }

  // 7. Contact / Phone / Location / Harshan / Address / Founder
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
📍 **ලිපිනය:** Pinnaduwa, Galle, Sri Lanka (Services available Islandwide & Globally)

ඔබට Harshan මහතා සමඟ සෘජුවම දුරකථනයෙන් සාකච්ඡා කිරීමට අවශ්‍ය නම් ඔබේ දුරකථන අංකය අප වෙත ලබාදෙන්න! 🤝📞`;
  }

  // 8. Tamil Inquiry (விலை / விவரங்கள் / வணக்கம்)
  if (
    clean.includes('விலை') || clean.includes('வணக்கம்') || clean.includes('இணையதளம்') ||
    clean.includes('விவரம்') || clean.includes('tamil')
  ) {
    return `வணக்கம்! 🙏✨
**Harsh Apex Digital Solutions**-க்கு உங்களை அன்புடன் வரவேற்கிறோம்! 🚀

நாங்கள் வழங்கும் முக்கிய டிஜிட்டல் சேவைகள்:
🌐 **1. வலைத்தள வடிவமைப்பு (Web Development)** - Rs. 35,000 முதல்
🛒 **2. E-Commerce ஆன்லைன் ஸ்டோர்** - Rs. 60,000 முதல்
🤖 **3. 24/7 WhatsApp AI Bot & Sales Assistant** - Rs. 25,000
💻 **4. POS & Billing System** - Rs. 45,000

மேலதிக விவரங்களுக்கு உங்கள் தேவையை இங்கே பதிவிடவும் அல்லது +94 77 066 3154 என்ற எண்ணை தொடர்பு கொள்ளவும். ✨`;
  }

  return null;
}
