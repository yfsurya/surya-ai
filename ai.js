async function fetchDeepAIResponse(message) {
    const apiKey = '111585f1-fb53-45e9-a448-862705891936'; // Replace with your actual API key

    try {
        const response = await fetch('https://api.deepai.org/api/text-generator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify({ text: message })
        });

        const data = await response.json();
        return data.output || "Sorry, I couldn't process your request.";
    } catch (error) {
        return 'Error connecting to DeepAI.';
    }
}

async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Display user message
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message message';
    userMessage.textContent = message;
    chatArea.appendChild(userMessage);
    chatInput.value = '';

    // Display AI thinking indicator
    const aiMessage = document.createElement('div');
    aiMessage.className = 'ai-message message';
    aiMessage.textContent = 'Thinking...';
    chatArea.appendChild(aiMessage);
    chatArea.scrollTop = chatArea.scrollHeight;

    // Fetch response from DeepAI
    const response = await fetchDeepAIResponse(message);
    aiMessage.textContent = response;
}
