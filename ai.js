// Save this as ai.js

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
const inputContainer = document.querySelector('.input-container');

// Add disclaimer message
const disclaimer = document.createElement('div');
disclaimer.style.position = 'fixed';
disclaimer.style.bottom = '5px';
disclaimer.style.left = '50%';
disclaimer.style.transform = 'translateX(-50%)';
disclaimer.style.fontSize = '12px';
disclaimer.style.color = 'var(--text-color)';
disclaimer.style.opacity = '0.7';
disclaimer.style.width = '100%';
disclaimer.style.textAlign = 'center';
disclaimer.style.marginBottom = '-25px';
disclaimer.textContent = 'Surya AI can make mistakes. Double check important information.';
inputContainer.appendChild(disclaimer);

// File input setup
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// Fixed DeepAI API Function
async function fetchDeepAIResponse(message) {
    try {
        const formData = new FormData();
        formData.append('text', message);
        
        const response = await fetch("https://api.deepai.org/api/text-generator", {
            method: "POST",
            headers: {
                'api-key': deepAIKey
            },
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.output || "Sorry, I couldn't process your request.";
    } catch (error) {
        console.error('DeepAI Error:', error);
        return "Error connecting to DeepAI. Please try again.";
    }
}

// Fixed Cohere API Function
async function fetchCohereResponse(message) {
    try {
        const response = await fetch("https://api.cohere.ai/v1/generate", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${cohereKey}`,
                "Content-Type": "application/json",
                "Cohere-Version": "2022-12-06"
            },
            body: JSON.stringify({
                model: "command",
                prompt: message,
                max_tokens: 300,
                temperature: 0.9,
                k: 0,
                stop_sequences: [],
                return_likelihoods: "NONE"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.generations && data.generations[0] ? data.generations[0].text : "Sorry, I couldn't process your request.";
    } catch (error) {
        console.error('Cohere Error:', error);
        return "Error connecting to Cohere. Please try again.";
    }
}

// Enhanced send message function
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
        
        // Add typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingIndicator.appendChild(dot);
        }
        aiMessage.appendChild(typingIndicator);
        chatArea.appendChild(aiMessage);
        
        try {
            // Fetch AI response with retries
            let response;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (attempts < maxAttempts) {
                try {
                    if (selectedAPI === "deepai") {
                        response = await fetchDeepAIResponse(message);
                    } else if (selectedAPI === "cohere") {
                        response = await fetchCohereResponse(message);
                    }
                    break;
                } catch (error) {
                    attempts++;
                    if (attempts === maxAttempts) {
                        throw error;
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                }
            }
            
            aiMessage.textContent = response;
        } catch (error) {
            aiMessage.textContent = "I'm having trouble connecting right now. Please try again in a moment.";
            console.error('Error:', error);
        }
    }
    
    chatArea.scrollTop = chatArea.scrollHeight;
    chatInput.value = '';
}

// Rest of your existing event listeners remain the same
[Previous event listeners for send button, enter key, mic button, etc...]

// Update menu item links
document.querySelectorAll('.menu-item').forEach(item => {
    const text = item.querySelector('span:last-child').textContent;
    if (text === 'Help' || text === 'Settings') {
        // Remove existing button/link structure
        const parent = item.parentElement;
        const grandparent = parent.parentElement;
        grandparent.removeChild(parent);
        
        // Create new link
        const link = document.createElement('a');
        link.href = text.toLowerCase() + '.html';
        link.style.textDecoration = 'none';
        link.style.color = 'inherit';
        
        // Create new menu item
        const newItem = document.createElement('div');
        newItem.className = 'menu-item';
        newItem.innerHTML = `
            <span class="material-icons">${text.toLowerCase()}</span>
            <span>${text}</span>
        `;
        
        link.appendChild(newItem);
        grandparent.appendChild(link);
    }
});

// Rest of your existing code...
[Rest of the previous code including image preview handling and menu icon updates]
