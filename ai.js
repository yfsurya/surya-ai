// Add to the existing HTML file, just before the closing </body> tag

// API Keys and Selection
const deepAIKey = "111585f1-fb53-45e9-a448-862705891936";
const cohereKey = "SIofAYox9NjOOHy3z4XGo9CoRCZfvd01LJSj0f5y";
let selectedAPI = "deepai";

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';

// Chat elements
const chatArea = document.querySelector('.chat-area');
const chatInput = document.getElementById('chat-input');
const sendButton = document.querySelector('.material-icons:last-child');
const micButton = document.querySelector('.material-icons:nth-last-child(2)');
const imageButton = document.querySelector('.material-icons:first-child');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// AI API Functions
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

// Enhanced send message function with AI integration
async function sendMessage(message, type = 'text', imageUrl = null) {
    if (type === 'text' && (!message || !message.trim())) return;
    
    // Create and display user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user-message';
    
    if (type === 'text') {
        userMessageDiv.textContent = message;
    } else if (type === 'image') {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.maxWidth = '200px';
        img.style.maxHeight = '200px';
        img.style.borderRadius = '5px';
        userMessageDiv.appendChild(img);
    }
    
    chatArea.appendChild(userMessageDiv);
    
    if (type === 'text') {
        // Create and display AI thinking indicator
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message message';
        aiMessage.textContent = 'Thinking...';
        chatArea.appendChild(aiMessage);
        
        // Fetch AI response
        let response = "Error: No API selected.";
        if (selectedAPI === "deepai") {
            response = await fetchDeepAIResponse(message);
        } else if (selectedAPI === "cohere") {
            response = await fetchCohereResponse(message);
        }
        
        aiMessage.textContent = response;
    }
    
    chatArea.scrollTop = chatArea.scrollHeight;
    chatInput.value = '';
}

// Send button click handler
sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        sendMessage(message);
    }
});

// Enter key handler
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message) {
            sendMessage(message);
        }
    }
});

// Microphone button handler
let isListening = false;
micButton.addEventListener('click', () => {
    if (!isListening) {
        recognition.start();
        micButton.style.color = '#ff0000';
        isListening = true;
    } else {
        recognition.stop();
        micButton.style.color = '';
        isListening = false;
    }
});

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    micButton.style.color = '';
    isListening = false;
};

recognition.onend = () => {
    micButton.style.color = '';
    isListening = false;
};

// Image upload handler
imageButton.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            sendMessage('', 'image', e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Update menu icons to match the design
document.querySelectorAll('.material-icons').forEach(icon => {
    if (icon.textContent === 'brightness_6') {
        icon.textContent = 'brightness_4';  // Filled moon icon for dark mode
    }
});
