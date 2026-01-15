// Set BACKEND_URL from environment or fallback
const BACKEND_URL = window.BACKEND_URL || 'http://localhost:3001';
const input = document.querySelector('#input');
const chatContainer = document.querySelector('#chat-container > div'); // Changed to target the inner container
const chatForm = document.querySelector('#chat-form');

const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

chatForm?.addEventListener('submit', handleSubmit);

// Create typing indicator element
const typingIndicator = document.createElement('div');
typingIndicator.className = 'flex items-start space-x-3 mt-4 typing-indicator hidden';
typingIndicator.innerHTML = `
    <div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
        <i class="fas fa-robot text-gray-500"></i>
    </div>
    <div class="bg-white p-4 rounded-xl shadow-sm max-w-[85%] space-y-2">
        <div class="flex space-x-2">
            <div class="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
    </div>
`;
chatContainer.appendChild(typingIndicator);

async function showTypingIndicator(show = true) {
    typingIndicator.classList.toggle('hidden', !show);
    if (show) {
        // Auto-scroll to bottom when showing typing indicator
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

async function addMessage(text, isUser = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start space-x-3 mt-4 ${isUser ? 'justify-end' : ''}`;
    
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="bg-blue-500 text-white p-3 rounded-xl max-w-[85%] shadow">
                <p>${text}</p>
            </div>
            <div class="w-8 h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold">
                ${(localStorage.getItem('userInitial') || 'U').toUpperCase()}
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                <i class="fas fa-robot text-gray-500"></i>
            </div>
            <div class="bg-white p-4 rounded-xl shadow-sm max-w-[85%]">
                <p class="whitespace-pre-wrap">${text}</p>
            </div>
        `;
    }
    
    chatContainer.insertBefore(messageDiv, typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function generate(text) {
    if (!text.trim()) return;
    
    // Add user message
    await addMessage(text, true);
    input.value = '';
    
    // Show typing indicator
    await showTypingIndicator(true);
    
    try {
        // Call server
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                threadId: threadId, 
                message: text 
            }),
        });

        if (!response.ok) {
            throw new Error('Error generating the response.');
        }

        const result = await response.json();
        
        // Hide typing indicator and add response
        await showTypingIndicator(false);
        await addMessage(result.message, false);
        
    } catch (error) {
        console.error('Error:', error);
        await showTypingIndicator(false);
        await addMessage('Sorry, I encountered an error. Please try again later.', false);
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    const text = input?.value.trim();
    if (!text) return;
    
    // Save user initial if not set
    if (!localStorage.getItem('userInitial') && text.length > 0) {
        localStorage.setItem('userInitial', text[0]);
    }
    
    await generate(text);
    
    // Reset textarea height
    input.style.height = 'auto';
}

// Add keyboard shortcut (Enter to send, Shift+Enter for new line)
input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
    }
});
