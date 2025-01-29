const deepAIKey = "111585f1-fb53-45e9-a448-862705891936"; // Replace with your DeepAI API key
const cohereKey = "SIofAYox9NjOOHy3z4XGo9CoRCZfvd01LJSj0f5y"; // Replace with your Cohere API key
let selectedAPI = "deepai"; // Default API

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
    const chatInput = document.getElementById("chat-input");
    const chatArea = document.querySelector(".chat-area");
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

// API selection buttons
const deepaiButton = document.createElement("button");
deepaiButton.textContent = "Use DeepAI";
deepaiButton.onclick = () => {
    selectedAPI = "deepai";
    alert("Switched to DeepAI");
};

deepaiButton.style.position = "fixed";
deepaiButton.style.top = "10px";
deepaiButton.style.right = "120px";
deepaiButton.style.padding = "10px";
deepaiButton.style.background = "#007bff";
deepaiButton.style.color = "#ffffff";
deepaiButton.style.border = "none";
deepaiButton.style.cursor = "pointer";
deepaiButton.style.borderRadius = "5px";

document.body.appendChild(deepaiButton);

const cohereButton = document.createElement("button");
cohereButton.textContent = "Use Cohere";
cohereButton.onclick = () => {
    selectedAPI = "cohere";
    alert("Switched to Cohere");
};

cohereButton.style.position = "fixed";
cohereButton.style.top = "10px";
cohereButton.style.right = "10px";
cohereButton.style.padding = "10px";
cohereButton.style.background = "#28a745";
cohereButton.style.color = "#ffffff";
cohereButton.style.border = "none";
cohereButton.style.cursor = "pointer";
cohereButton.style.borderRadius = "5px";

document.body.appendChild(cohereButton);
