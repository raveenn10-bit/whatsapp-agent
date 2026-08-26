// App State & Tab Navigation
let currentTab = 'qr';
let ws = null;

function switchTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('bg-emerald-600/10', 'text-emerald-400', 'border', 'border-emerald-500/20');
    btn.classList.add('text-slate-400');
  });

  const activePanel = document.getElementById(`panel-${tab}`);
  const activeBtn = document.getElementById(`tab-btn-${tab}`);
  if (activePanel) activePanel.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.add('bg-emerald-600/10', 'text-emerald-400', 'border', 'border-emerald-500/20');
    activeBtn.classList.remove('text-slate-400');
  }

  if (tab === 'chats') loadChats();
  if (tab === 'orders') loadOrders();
  if (tab === 'leads') loadLeads();
  if (tab === 'services') loadServices();
}

// Initialize WebSocket for real-time updates
function initWebSocket() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${window.location.host}`);

  ws.onopen = () => {
    console.log('Connected to Dashboard WebSocket stream');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'QR_UPDATE') {
        renderQR(data.dataUrl);
      } else if (data.type === 'CONNECTED') {
        renderConnected(data.phoneNumber);
      } else if (data.type === 'DISCONNECTED') {
        renderDisconnected();
      } else if (data.type === 'NEW_MESSAGE') {
        appendChatMessage(data);
      }
    } catch (err) {
      console.error('Error parsing WS message:', err);
    }
  };

  ws.onclose = () => {
    setTimeout(initWebSocket, 3000);
  };
}

// Fetch and render initial status
async function loadStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();

    if (data.connected) {
      renderConnected(data.phoneNumber);
    } else if (data.qrDataUrl) {
      renderQR(data.qrDataUrl);
    }

    const aiStatusText = document.getElementById('ai-status-text');
    if (data.aiConfigured) {
      aiStatusText.textContent = `${data.geminiModel} (Active)`;
    } else {
      aiStatusText.textContent = `API Key Needed`;
      aiStatusText.parentElement.classList.add('border-amber-500/50', 'text-amber-300');
    }
  } catch (err) {
    console.error('Error loading status:', err);
  }
}

function renderQR(dataUrl) {
  const loading = document.getElementById('qr-loading');
  const img = document.getElementById('qr-image');
  const connectedBox = document.getElementById('connected-box');
  const qrWrapper = document.getElementById('qr-wrapper');

  if (loading) loading.classList.add('hidden');
  if (connectedBox) connectedBox.classList.add('hidden');
  if (qrWrapper) qrWrapper.classList.remove('hidden');

  if (img) {
    img.src = dataUrl;
    img.classList.remove('hidden');
  }

  const badge = document.getElementById('wa-badge');
  const statusText = document.getElementById('wa-status-text');
  badge.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium';
  statusText.textContent = 'Scan QR to Pair';
}

function renderConnected(phoneNumber) {
  const qrWrapper = document.getElementById('qr-wrapper');
  const connectedBox = document.getElementById('connected-box');
  const phoneText = document.getElementById('connected-phone-text');

  if (qrWrapper) qrWrapper.classList.add('hidden');
  if (connectedBox) connectedBox.classList.remove('hidden');
  if (phoneText) phoneText.textContent = `Linked with phone: +${phoneNumber || 'Active'}`;

  const badge = document.getElementById('wa-badge');
  const statusText = document.getElementById('wa-status-text');
  badge.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium';
  statusText.textContent = 'WhatsApp Connected';
}

function renderDisconnected() {
  const badge = document.getElementById('wa-badge');
  const statusText = document.getElementById('wa-status-text');
  badge.className = 'flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium';
  statusText.textContent = 'WhatsApp Disconnected';
}

// Load Chat Messages
async function loadChats() {
  try {
    const res = await fetch('/api/chats');
    const messages = await res.json();
    const container = document.getElementById('chat-messages');
    container.innerHTML = '';
    messages.forEach(msg => appendChatMessage(msg));
    container.scrollTop = container.scrollHeight;
  } catch (err) {
    console.error('Error loading chats:', err);
  }
}

function appendChatMessage(msg) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const isUser = msg.sender === 'customer';
  const isAgent = msg.sender === 'agent';
  const bubble = document.createElement('div');
  bubble.className = `flex flex-col ${isUser ? 'items-start' : 'items-end'}`;

  const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const senderLabel = isUser ? `Customer (+${msg.phone || ''})` : (isAgent ? `Harsh Apex AI` : `Manual Agent`);

  bubble.innerHTML = `
    <div class="max-w-[75%] rounded-2xl p-3 text-xs shadow-md ${
      isUser
        ? 'bg-slate-800 text-slate-100 border border-slate-700'
        : 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
    }">
      <div class="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75 font-semibold">
        <span>${senderLabel}</span>
        <span>${timeStr}</span>
      </div>
      <div class="whitespace-pre-wrap leading-relaxed">${escapeHtml(msg.content)}</div>
    </div>
  `;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// Manual Message Sender
async function sendManualMessage() {
  const phoneInput = document.getElementById('reply-phone');
  const textInput = document.getElementById('reply-text');

  const phone = phoneInput.value.trim();
  const text = textInput.value.trim();
  if (!phone || !text) return alert('Please enter both phone number and message.');

  try {
    const res = await fetch('/api/chats/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, text })
    });
    const result = await res.json();
    if (result.success) {
      textInput.value = '';
      loadChats();
    } else {
      alert(`Failed to send: ${result.error}`);
    }
  } catch (err) {
    alert('Error sending message');
  }
}

// Load Orders
async function loadOrders() {
  try {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-slate-500">No orders placed yet.</td></tr>`;
      return;
    }

    orders.forEach(ord => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-900/60 transition';
      tr.innerHTML = `
        <td class="py-3 px-4 font-mono font-semibold text-emerald-400">${ord.id}</td>
        <td class="py-3 px-4">
          <div class="font-medium text-slate-200">${escapeHtml(ord.customerName)}</div>
          <div class="text-[11px] text-slate-400 font-mono">+${ord.customerPhone}</div>
        </td>
        <td class="py-3 px-4 font-medium text-slate-300">${escapeHtml(ord.serviceName)}</td>
        <td class="py-3 px-4 font-semibold text-slate-200">${ord.currency} ${ord.amount.toLocaleString()}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-1 rounded text-[10px] font-semibold ${
            ord.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300' :
            ord.status === 'COMPLETED' ? 'bg-cyan-500/20 text-cyan-300' :
            'bg-amber-500/20 text-amber-300'
          }">${ord.status}</span>
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-1 rounded text-[10px] font-semibold ${
            ord.paymentStatus === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }">${ord.paymentStatus}</span>
        </td>
        <td class="py-3 px-4 text-slate-400">${new Date(ord.createdAt).toLocaleDateString()}</td>
        <td class="py-3 px-4">
          <button onclick="updateOrderStatus('${ord.id}', 'CONFIRMED', 'VERIFIED')" class="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded text-[10px] font-medium transition mr-1">
            Confirm
          </button>
          <button onclick="updateOrderStatus('${ord.id}', 'COMPLETED')" class="px-2 py-1 bg-cyan-600/30 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded text-[10px] font-medium transition">
            Complete
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading orders:', err);
  }
}

async function updateOrderStatus(id, status, paymentStatus) {
  try {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, paymentStatus })
    });
    loadOrders();
  } catch (err) {
    console.error('Error updating order:', err);
  }
}

// Load Leads
async function loadLeads() {
  try {
    const res = await fetch('/api/leads');
    const leads = await res.json();
    const tbody = document.getElementById('leads-tbody');
    tbody.innerHTML = '';

    if (leads.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500">No leads recorded yet.</td></tr>`;
      return;
    }

    leads.forEach(lead => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-900/60 transition';
      tr.innerHTML = `
        <td class="py-3 px-4 font-mono font-semibold text-cyan-400">${lead.id}</td>
        <td class="py-3 px-4 font-medium text-slate-200">${escapeHtml(lead.customerName)}</td>
        <td class="py-3 px-4 font-mono text-slate-300">+${lead.customerPhone}</td>
        <td class="py-3 px-4 text-slate-300 font-medium">${escapeHtml(lead.serviceInterest)}</td>
        <td class="py-3 px-4 text-slate-400">${lead.language || 'Sinhala'}</td>
        <td class="py-3 px-4 text-slate-400 max-w-xs truncate">${escapeHtml(lead.notes || '')}</td>
        <td class="py-3 px-4 text-slate-400">${new Date(lead.createdAt).toLocaleDateString()}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Error loading leads:', err);
  }
}

// Load Services
async function loadServices() {
  try {
    const res = await fetch('/api/services');
    const services = await res.json();
    const grid = document.getElementById('services-grid');
    grid.innerHTML = '';

    services.forEach(srv => {
      const card = document.createElement('div');
      card.className = 'bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition';
      card.innerHTML = `
        <div class="flex items-start justify-between">
          <div>
            <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">${escapeHtml(srv.category)}</span>
            <h3 class="font-bold text-sm text-slate-100">${escapeHtml(srv.name)}</h3>
          </div>
          <span class="text-xs font-bold text-slate-200 bg-slate-800 px-2 py-1 rounded-md">${srv.currency} ${srv.price.toLocaleString()}</span>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">${escapeHtml(srv.description)}</p>
        <ul class="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-slate-900">
          ${(srv.features || []).map(f => `<li class="flex items-center gap-1.5"><i class="fa-solid fa-check text-emerald-400 text-[10px]"></i> ${escapeHtml(f)}</li>`).join('')}
        </ul>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading services:', err);
  }
}

// Save Gemini API Key
async function saveApiKey() {
  const input = document.getElementById('gemini-key-input');
  const apiKey = input.value.trim();
  if (!apiKey) return alert('Please enter your Google Gemini API Key.');

  try {
    const res = await fetch('/api/settings/apikey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
    const result = await res.json();
    if (result.success) {
      alert('Gemini API Key saved successfully!');
      loadStatus();
    }
  } catch (err) {
    alert('Error saving API Key');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Start on load
window.addEventListener('DOMContentLoaded', () => {
  initWebSocket();
  loadStatus();
  setInterval(loadStatus, 10000);
});
