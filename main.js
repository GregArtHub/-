 document.addEventListener('DOMContentLoaded', function() {
            const chatMessages = document.getElementById('chat-messages');
            const messageInput = document.getElementById('message-input');
            const sendButton = document.getElementById('send-button');
            
            let userName = '';
            let numbersToCalculate = [];
            let waitingForOperation = false;
            
            messageInput.addEventListener('input', function() {
                if (messageInput.value.trim().length > 0) {
                    sendButton.disabled = false;
                    sendButton.classList.add('active');
                } else {
                    sendButton.disabled = true;
                    sendButton.classList.remove('active');
                }
                
             
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
            
            sendButton.addEventListener('click', sendMessage);
            
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey && messageInput.value.trim().length > 0) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            function sendMessage() {
                const messageText = messageInput.value.trim();
                if (messageText.length === 0) return;
                
                addMessage(messageText, 'user');
                messageInput.value = '';
                sendButton.disabled = true;
                sendButton.classList.remove('active');
                messageInput.style.height = 'auto';
                
                
                showTypingIndicator();
                
                
                setTimeout(() => {
                    removeTypingIndicator();
                    processUserMessage(messageText);
                }, 1000 + Math.random() * 1000);
            }
            
            function addMessage(text, sender) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container', sender);
                
                const avatar = document.createElement('div');
                avatar.classList.add('avatar', sender === 'user' ? 'user-avatar' : 'bot-avatar');
                
                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
                messageDiv.textContent = text;
                
                if (sender === 'user') {
                    messageContainer.appendChild(messageDiv);
                    messageContainer.appendChild(avatar);
                } else {
                    messageContainer.appendChild(avatar);
                    messageContainer.appendChild(messageDiv);
                }
                
                chatMessages.insertBefore(messageContainer, chatMessages.firstChild);
            }
            
            function showTypingIndicator() {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message-container', 'bot');
                
                const avatar = document.createElement('div');
                avatar.classList.add('avatar', 'bot-avatar');
                
                const typingDiv = document.createElement('div');
                typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
                typingDiv.id = 'typing-indicator';
                typingDiv.innerHTML = `
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                `;
                
                messageContainer.appendChild(avatar);
                messageContainer.appendChild(typingDiv);
                chatMessages.insertBefore(messageContainer, chatMessages.firstChild);
            }
            
            function removeTypingIndicator() {
                const typingIndicator = document.getElementById('typing-indicator');
                if (typingIndicator) {
                    typingIndicator.parentElement.remove();
                }
            }
            
            function processUserMessage(message) {
                if (waitingForOperation) {
                    processOperation(message);
                    return;
                }
                
                if (message.startsWith('/')) {
                    processCommand(message);
                } else if (numbersToCalculate.length > 0) {
                    addMessage('Пожалуйста, введите команду для вычисления (+, -, *, /)', 'bot');
                    waitingForOperation = true;
                } else {
                    addMessage('Я не понимаю, введите другую команду!', 'bot');
                }
            }
            
            function processCommand(command) {
                if (command === '/start') {
                    userName = '';
                    numbersToCalculate = [];
                    waitingForOperation = false;
                    addMessage('Привет, меня зовут Чат-бот, а как зовут тебя?', 'bot');
                } else if (command.startsWith('/name:')) {
                    userName = command.split(':')[1].trim();
                    addMessage(`Привет ${userName}, приятно познакомится. Я умею считать, введи числа которые надо посчитать`, 'bot');
                } else if (command.startsWith('/number:')) {
                    const numbersStr = command.split(':')[1].trim();
                    numbersToCalculate = numbersStr.split(',').map(num => parseFloat(num.trim()));
                    
                    if (numbersToCalculate.length === 2 && !isNaN(numbersToCalculate[0]) && !isNaN(numbersToCalculate[1])) {
                        addMessage(`Хорошо, я запомнил числа ${numbersToCalculate[0]} и ${numbersToCalculate[1]}. Какое действие выполнить? (+, -, *, /)`, 'bot');
                        waitingForOperation = true;
                    } else {
                        addMessage('Пожалуйста, введите два числа через запятую, например: /number: 5, 3', 'bot');
                        numbersToCalculate = [];
                    }
                } else if (command === '/stop') {
                    addMessage('Всего доброго, если хочешь поговорить пиши /start', 'bot');
                    userName = '';
                    numbersToCalculate = [];
                    waitingForOperation = false;
                } else {
                    addMessage('Я не понимаю, введите другую команду!', 'bot');
                }
            }
            
            function processOperation(operation) {
                operation = operation.trim();
                if (['+', '-', '*', '/'].includes(operation)) {
                    let result;
                    const a = numbersToCalculate[0];
                    const b = numbersToCalculate[1];
                    
                    switch (operation) {
                        case '+':
                            result = a + b;
                            break;
                        case '-':
                            result = a - b;
                            break;
                        case '*':
                            result = a * b;
                            break;
                        case '/':
                            result = b !== 0 ? a / b : 'Ошибка: деление на ноль';
                            break;
                    }
                    
                    addMessage(`Результат: ${a} ${operation} ${b} = ${result}`, 'bot');
                } else {
                    addMessage('Пожалуйста, введите одну из операций: +, -, *, /', 'bot');
                    return;
                }
                
                numbersToCalculate = [];
                waitingForOperation = false;
            }
            
            setTimeout(() => {
                addMessage('Введите команду /start, для начала общения', 'bot');
            }, 500);
        });
