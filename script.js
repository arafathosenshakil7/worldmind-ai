িconst chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const message = userInput.value.trim();

  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  const loading = addMessage('Thinking...', 'bot');

  try {
    const prompt = "You are WorldMind AI, reply in same language user used. User: " + message;
    const res = await fetch("https://text.pollinations.ai/" + encodeURIComponent(prompt));
    const data = await res.text();
    loading.textContent = data;
  } catch (e) {
    loading.textContent = "Sorry, network problem. Try again.";
  }
});

function addMessage(text, type) {
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", type);
  messageElement.textContent = text;

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
