const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const message = userInput.value.trim();

  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  setTimeout(function () {
    addMessage(
      "Thanks for your message! WorldMind AI is currently a UI prototype. Real AI services will be connected in a future update.",
      "bot"
    );
  }, 500);
});

function addMessage(text, type) {
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", type);
  messageElement.textContent = text;

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
