// WorldMind AI - Frontend, NO API KEY HERE
let chats = JSON.parse(localStorage.getItem('worldmind_chats') || '[]');
let currentChatId = null;

const chatMessages = document.getElementById('chatMessages');
const chatList = document.getElementById('chatList');
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');

function save() {
  localStorage.setItem('worldmind_chats', JSON.stringify(chats));
  renderList();
  updateDashboard();
}

function newChat() {
  const chat = { id: Date.now(), title: 'New Chat', messages: [{ role: 'model', text: 'Hello! Welcome to WorldMind AI. How can I help you?' }] };
  chats.unshift(chat);
  currentChatId = chat.id;
  save();
  renderChat();
}

function addBubble(role, text) {
  const div = document.createElement('div');
  div.className = 'message ' + (role === 'user' ? 'user' : 'bot');
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderChat() {
  const chat = chats.find(c => c.id === currentChatId);
  if (!chat) return;
  chatMessages.innerHTML = '';
  chat.messages.forEach(m => addBubble(m.role, m.text));
}

function renderList() {
  if (!chatList) return;
  chatList.innerHTML = '';
  chats.forEach(c => {
    const d = document.createElement('div');
    d.className = 'chat-item' + (c.id === currentChatId ? ' active' : '');
    d.textContent = c.title;
    d.onclick = () => { currentChatId = c.id; renderChat(); renderList(); };
    chatList.appendChild(d);
  });
}

function updateDashboard() {
  const tc = document.getElementById('totalChats');
  const tm = document.getElementById('totalMsgs');
  if (tc) tc.textContent = chats.length;
  let total = 0;
  chats.forEach(c => total += c.messages.length);
  if (tm) tm.textContent = total;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = userInput.value.trim();
  if (!text) return;
  if (!currentChatId) newChat();
  const chat = chats.find(c => c.id === currentChatId);
  if (chat.messages.length <= 1) chat.title = text.slice(0, 30);

  chat.messages.push({ role: 'user', text });
  addBubble('user', text);
  userInput.value = '';
  save();

  const typing = document.createElement('div');
  typing.className = 'message bot typing';
  typing.textContent = 'WorldMind লিখছে...';
  chatMessages.appendChild(typing);

  try {
    const history = chat.messages.slice(-10);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    });
    const data = await res.json();
    typing.remove();
    if (data.error) throw new Error(data.error);
    chat.messages.push({ role: 'model', text: data.reply });
    addBubble('model', data.reply);
    save();
  } catch (err) {
    typing.remove();
    addBubble('model', 'সার্ভার এখনো লাগানো হয় নাই। Vercel-এ Deploy + API Key বসানোর পর কাজ করবে।');
  }
});

document.getElementById('newChatBtn').onclick = newChat;
document.getElementById('menuBtn').onclick = () => document.getElementById('sidebar').classList.toggle('open');
document.getElementById('settingsBtn').onclick = () => document.getElementById('settingsModal').classList.remove('hidden');
document.getElementById('closeSettings').onclick = () => document.getElementById('settingsModal').classList.add('hidden');
document.getElementById('clearAllBtn').onclick = () => { localStorage.removeItem('worldmind_chats'); location.reload(); };
document.getElementById('themeSelect').onchange = (e) => {
  document.body.className = e.target.value === 'light' ? 'light-theme' : '';
};

if (chats.length === 0) newChat();
else { currentChatId = chats[0].id; renderChat(); }
renderList();
updateDashboard();
