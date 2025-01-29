// Add this script before the closing </body> tag

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;

const chatInput = document.getElementById('chat-input');
const chatArea = document.querySelector('.chat-area');

// Add send button to input container
const inputContainer = document.querySelector('.input-container');
const sendButton = document.createElement('span');
sendButton.className = 'material-icons';
sendButton.textContent = 'send';
inputContainer.appendChild(sendButton);

// Style chat area
chatArea.style.width = '100%';
chatArea.style.height = 'calc(100vh - 100px)';
chatArea.style.overflow = 'auto';
chatArea.style.padding = '20px';

// Handle microphone
let isRecording = false;
const micButton = document.querySelector('.input-container .material-icons:nth-child(3)');

micButton.addEventListener('click', () => {
    if (!isRecording) {
        recognition.start();
        micButton.style.color = '#ff4444';
        isRecording = true;
    } else {
        recognition.stop();
        micButton.style.color = '';
        isRecording = false;
    }
});

recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    
    chatInput.value = transcript;
};

recognition.onend = () => {
    micButton.style.color = '';
    isRecording = false;
};

// Handle image upload
const imageButton = document.querySelector('.input-container .material-icons:first-child');
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

imageButton.addEventListener('click', () => {
    fileInput.click();
});

let selectedImage = null;

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImage = e.target.result;
            // Show image preview
            const preview = document.createElement('div');
            preview.style.padding = '10px';
            preview.innerHTML = `<img src="${selectedImage}" style="max-width: 200px; display: block;">`;
            chatInput.parentElement.appendChild(preview);
        };
        reader.readAsDataURL(file);
    }
});

// Handle sending messages
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message && !selectedImage) return;

    // Create message bubble
    const userMessage = document.createElement('div');
    userMessage.style.margin = '10px';
    userMessage.style.padding = '10px';
    userMessage.style.backgroundColor = 'var(--input-bg)';
    userMessage.style.borderRadius = '10px';
    userMessage.style.maxWidth = '70%';
    userMessage.style.marginLeft = 'auto';

    let messageContent = '';
    if (message) messageContent += `<p>${message}</p>`;
    if (selectedImage) {
        messageContent += `<img src="${selectedImage}" style="max-width: 200px; display: block; margin-top: 10px;">`;
    }
    userMessage.innerHTML = messageContent;
    chatArea.appendChild(userMessage);

    // Clear input and image
    chatInput.value = '';
    selectedImage = null;
    const preview = chatInput.parentElement.querySelector('img')?.parentElement;
    if (preview) preview.remove();

    // Simulate Claude response (replace this with actual Claude API integration)
    const aiResponse = document.createElement('div');
    aiResponse.style.margin = '10px';
    aiResponse.style.padding = '10px';
    aiResponse.style.backgroundColor = 'var(--sidebar-bg)';
    aiResponse.style.borderRadius = '10px';
    aiResponse.style.maxWidth = '70%';
    
    // Add loading indicator
    aiResponse.textContent = 'Thinking...';
    chatArea.appendChild(aiResponse);

    try {
        // Replace this with actual Claude API call
        const response = await simulateClaudeResponse(message, selectedImage);
        aiResponse.textContent = response;
    } catch (error) {
        aiResponse.textContent = 'Sorry, I encountered an error processing your message.';
    }

    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Simulate Claude response (replace with actual API integration)
async function simulateClaudeResponse(message, image) {
    // This is where you'd integrate with Claude's API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`This is a simulated response to: "${message}"`);
        }, 1000);
    });
}

// Add event listeners for sending messages
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
