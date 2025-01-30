const deepAIKey = "111585f1-fb53-45e9-a448-862705891936"; // Replace with your DeepAI API key
const cohereKey = "SIofAYox9NjOOHy3z4XGo9CoRCZfvd01LJSj0f5y"; // Replace with your Cohere API key
let selectedAPI = "deepai"; // Default API

const chatArea = document.querySelector(".chat-area");
const chatInput = document.getElementById("chat-input");
const sendButton = document.querySelector(".material-icons.send");

async function fetchDeepAIResponse(message) {
    try {
        const response = await fetch("https://api.deepai.org/api/text-generator", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": deepAIKey
            },
            body: JSON.stringify({ text: message })
        });

        const data = await response.json();
        return data.output || "Sorry, I couldn't process your request.";
    } catch (error) {
        return "Error connecting to DeepAI.";
    }
}

async function fetchCohereResponse(message) {
    try {
        const response = await fetch("https://api.cohere.ai/v1/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cohereKey}`
            },
            body: JSON.stringify({
                model: "command",
                prompt: message,
                max_tokens: 100
            })
        });

        const data = await response.json();
        return data.generations[0].text || "Sorry, I couldn't process your request.";
    } catch (error) {
        return "Error connecting to Cohere.";
    }
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Display user message
    const userMessage = document.createElement("div");
    userMessage.className = "user-message message";
    userMessage.textContent = message;
    chatArea.appendChild(userMessage);
    chatInput.value = "";

    // Display AI thinking indicator
    const aiMessage = document.createElement("div");
    aiMessage.className = "ai-message message";
    aiMessage.textContent = "Thinking...";
    chatArea.appendChild(aiMessage);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Fetch response from selected AI API
    let response = "Error: No API selected.";
    if (selectedAPI === "deepai") {
        response = await fetchDeepAIResponse(message);
    } else if (selectedAPI === "cohere") {
        response = await fetchCohereResponse(message);
    }

    aiMessage.textContent = response;
}

// Send message when Enter is pressed
chatInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Send message when send button is clicked
sendButton.addEventListener("click", sendMessage);
    }

    aiMessage.textContent = response;
}
