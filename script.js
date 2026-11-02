// WorldMind AI - Main JavaScript

const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatMessages = document.getElementById("chatMessages");

// Display a message in chat
function addMessage(message, sender) {
  const messageElement = document.createElement("div");

  messageElement.className = `message ${sender}`;
  messageElement.textContent = message;

  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle chat submission
if (chatForm) {
  chatForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const message = userInput.value.trim();

    if (!message) return;

    addMessage(message, "user");

    userInput.value = "";

    addMessage(
      "আপনার বার্তাটি গ্রহণ করেছি। AI সার্ভার সংযুক্ত হলে আমি উত্তর দিতে পারব।",
      "assistant"
    );
  });
}

// Welcome message
console.log("WorldMind AI is ready!");
