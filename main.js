const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');
let typingTimeout;

function showTypingIndicator() {
    let typingIndicator = document.getElementById('typing-indicator');
    if (!typingIndicator) {
        const container = document.createElement('div');
        container.classList.add('message-container', 'bot');
        container.id = 'typing-indicator';

        const avatar = document.createElement('div');
        avatar.classList.add('avatar', 'bot-avatar');

        const typing = document.createElement('div');
        typing.classList.add('message', 'bot-message', 'typing-indicator');
        typing.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;

        container.appendChild(avatar);
        container.appendChild(typing);
        chatMessages.insertBefore(container, chatMessages.firstChild);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function removeTypingIndicator() {
    const typing = document.getElementById('typing-indicator');
    if (typing) {
        chatMessages.removeChild(typing);
    }
}

// Активируем кнопку, если есть текст
messageInput.addEventListener('input', () => {
    sendButton.disabled = !messageInput.value.trim();
    sendButton.classList.toggle('active', messageInput.value.trim());

    // Показываем анимацию троеточия при вводе текста
    clearTimeout(typingTimeout);
    showTypingIndicator();
    typingTimeout = setTimeout(removeTypingIndicator, 1000); // Убираем анимацию через 1 секунду без активности
});

// Отправка сообщения при нажатии Enter
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// При нажатии на кнопку
sendButton.addEventListener('click', sendMessage);

function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    removeTypingIndicator(); // Убираем анимацию перед отправкой
    addMessage(text, 'user');
    messageInput.value = '';
    sendButton.disabled = true;
    sendButton.classList.remove('active');

    // Симулируем "ответ бота" через 1 секунду
    showTypingIndicator();
    setTimeout(() => {
        removeTypingIndicator();
        const botReply = getBotResponse(text);
        addMessage(botReply, 'bot');
    }, 1000);
}

function addMessage(text, sender) {
    const container = document.createElement('div');
    container.classList.add('message-container', sender);

    const avatar = document.createElement('div');
    avatar.classList.add('avatar', sender === 'user' ? 'user-avatar' : 'bot-avatar');

    const message = document.createElement('div');
    message.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    message.textContent = text;

    container.appendChild(sender === 'user' ? message : avatar);
    container.appendChild(sender === 'user' ? avatar : message);

    chatMessages.insertBefore(container, chatMessages.firstChild);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Логика ответа бота
function getBotResponse(userMessage) {
    const lower = userMessage.toLowerCase();
    
    if (lower === '/start') {
        return 'Введите команду /start, для начала общения';
    }
    
    if (lower.startsWith('/name:')) {
        const name = userMessage.slice(6).trim();
        return `Привет ${name}, приятно познакомиться. Я умею считать, введи числа которые надо посчитать`;
    }
    
    if (lower.includes('и') && /\d/.test(lower)) {
        const nums = lower.match(/\d+/g);
        if (nums && nums.length >= 2) {
            const num1 = parseInt(nums[0]);
            const num2 = parseInt(nums[1]);
            return `${num1} и ${num2}\nСумма: ${num1 + num2}`;
        }
    }
    
    return 'Я не понимаю, введите другую команду!';
}
