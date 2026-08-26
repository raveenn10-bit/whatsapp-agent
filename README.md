# 🚀 Harsh Apex Digital Solutions - 24/7 AI WhatsApp Sales Agent

An advanced, 24/7 Intelligent WhatsApp Sales & Customer Support Agent powered by **Google Gemini 2.5 Flash** and **Baileys WhatsApp Multi-Device Gateway**.

---

## 🌟 Key Features

1. **Trilingual & Singlish Support (සිංහල / Singlish / தமிழ் / English):**
   - Responds naturally and politely in Sinhala, Singlish (*"aiye mekata kiyak yaida"*), Tamil (*"வணக்கம், எனக்கு ஒரு இணையதளம் வேண்டும்"*), and English.
2. **Bank Payment Slip & Vision AI:**
   - Detects and verifies bank transfer receipts/deposit slip images automatically (Bank Name, Amount, Reference ID, Date).
3. **Automated Order & Lead Capturing (CRM):**
   - Takes client orders, generates Order IDs, and qualifies leads into the database.
4. **Live Web Admin Dashboard (Port 3000):**
   - Scan QR code directly on web browser.
   - View live WhatsApp incoming messages and AI replies.
   - Manage Orders and mark them as Confirmed/Completed.
   - View Leads and customer inquiries.
   - Interactive Services & Pricing Catalog editor.
5. **Voice Note Recognition:**
   - Understands WhatsApp voice notes sent by customers.
6. **Google Sheets Sync:**
   - Optional instant sync of orders and leads to Google Sheets via Webhook.

---

## 🚀 Quick Start Guide

### Step 1: Add your Google Gemini API Key
1. Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open the `.env` file in the project folder and paste your key:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
   *(Or you can paste it directly in the Web Dashboard under the "AI & Settings" tab!)*

### Step 2: Start the Application
Run the following command in your terminal:
```bash
npm run dev
```

### Step 3: Connect WhatsApp
1. Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**
2. Open **WhatsApp** on your mobile phone.
3. Tap **Settings / 3 Dots** &rarr; **Linked Devices** &rarr; **Link a Device**.
4. Scan the QR code shown on the screen or in your terminal.
5. **You're all set!** Your 24/7 AI Sales Assistant is now live.

---

## 📁 Project Structure

- `src/`
  - `index.ts`: Application entry point.
  - `config.ts`: Configuration loader.
  - `ai/`:
    - `gemini.ts`: Google Gemini LLM, Multimodal Vision, and function calling loop.
    - `systemPrompt.ts`: Trilingual sales persona tailored for Harsh Apex Digital Solutions.
    - `memory.ts`: Context window memory per customer.
  - `whatsapp/`:
    - `client.ts`: Baileys multi-device socket connection.
    - `messageHandler.ts`: Message router, media downloader, typing presence.
    - `qrManager.ts`: QR code generator & events.
  - `tools/agentTools.ts`: Autonomous tools (`check_services`, `create_order`, `save_lead`, `verify_bank_slip`, `request_human_agent`).
  - `database/db.ts`: Orders, leads, messages, and services storage.
  - `dashboard/`: Express API and Web Admin Panel.
- `config/`
  - `business.json`: Company profile, phone, address, and bank transfer details.
  - `services.json`: Services catalog, packages, pricing, and features.

---

## 🧪 Testing Trilingual Conversations

You can send any of the following test messages to your connected WhatsApp number:

- **Sinhala / Singlish:**
  > *"Mata web site ekak hadaganna one. Price kiyada?"*
  > *"Oyalage WhatsApp AI Bot package eka gana visthara kiyanna"*
- **Tamil:**
  > *"வணக்கம்! உங்கள் டிஜிட்டல் சேவைகள் பற்றிய விவரங்களை அறிய விரும்புகிறேன்."*
- **English:**
  > *"Hi! Can you provide more details about your E-commerce web development package?"*
- **Bank Slip Verification:**
  > Send a photo of a bank transfer slip to verify payment.
