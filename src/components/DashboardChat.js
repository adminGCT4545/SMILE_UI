// Dashboard Chat Integration
class DashboardChat {
    constructor() {
        this.API_ENDPOINT = 'http://localhost:3002/api/chat';
        this.conversationHistory = [];
        this.isWaitingForResponse = false;
        this.isChatVisible = false;
        this.erpContext = null;
    }

    // Initialize chat interface
    async init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) throw new Error('Chat container not found');

        await this.loadERPContext();
        this.render();
        this.attachEventListeners();
        this.loadConversationHistory();
        
        // Add welcome message if no history
        if (this.conversationHistory.length === 0) {
            this.showWelcomeMessage();
        }
    }

    // Load ERP context data
    async loadERPContext() {
        try {
            // Get dashboard state from the window object
            const dashboardState = window.dashboardState || {};
            
            // Fetch ERP context from API
            let apiContext = {};
            try {
                const response = await fetch('/api/erp/context');
                if (!response.ok) throw new Error(`API returned ${response.status}`);
                apiContext = await response.json();
            } catch (error) {
                console.warn('[DashboardChat] Failed to fetch API context:', error);
            }

            // Combine dashboard state with API context
            this.erpContext = {
                ...dashboardState,
                ...apiContext,
                source: 'kynsey-ai',
                timestamp: new Date().toISOString()
            };

            console.log('[DashboardChat] ERP context loaded:', {
                stateSize: Object.keys(dashboardState).length,
                apiDataSize: Object.keys(apiContext).length
            });
        } catch (error) {
            console.error('[DashboardChat] Failed to load ERP context:', error);
            this.erpContext = {
                error: 'Failed to load context',
                source: 'kynsey-ai',
                timestamp: new Date().toISOString()
            };
        }
    }

    // Show welcome message
    showWelcomeMessage() {
        const welcomeMessage = "Hello! I'm your Kynsey AI assistant. I can help you understand the dashboard data, analyze trends, and answer any questions about the ERP system. What would you like to know?";
        this.renderMessage(welcomeMessage, 'assistant-message');
        this.conversationHistory.push({
            role: 'assistant',
            content: welcomeMessage
        });
    }

    // Render chat interface
    render() {
        const chatHtml = `
            <div class="dashboard-chat ${this.isChatVisible ? 'visible' : ''}">
                <div class="chat-header">
                    <h3>KYNSEY AI Assistant</h3>
                    <button class="toggle-chat-btn" title="Close Chat">×</button>
                </div>
                <div class="chat-messages" id="chatMessages"></div>
                <div class="chat-input">
                    <textarea 
                        placeholder="Ask me about the ERP system or dashboard data..."
                        rows="1"
                        id="messageInput"
                        aria-label="Chat message input"
                    ></textarea>
                    <button id="sendMessage" disabled title="Send message">Send</button>
                </div>
                <div class="loading-indicator" style="display: none;" aria-live="polite">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            <button class="chat-trigger-btn ${this.isChatVisible ? 'hidden' : ''}" title="Open Chat">
                <span>Ask Kynsey</span>
            </button>
        `;

        this.container.innerHTML = chatHtml;
        this.attachStyles();
    }

    // Attach required styles
    attachStyles() {
        const styles = `
            .dashboard-chat {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: #202124;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: translateY(150%);
                transition: transform 0.3s ease;
                z-index: 1000;
            }

            .dashboard-chat.visible {
                transform: translateY(0);
            }

            .chat-header {
                padding: 16px;
                background: #2c2c2c;
                color: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #3d3d3e;
            }

            .chat-header h3 {
                margin: 0;
                font-size: 16px;
            }

            .toggle-chat-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                padding: 0 4px;
            }

            .chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
            }

            .message {
                margin-bottom: 12px;
                max-width: 80%;
                padding: 8px 12px;
                border-radius: 12px;
                word-wrap: break-word;
            }

            .user-message {
                background: #0b84ff;
                color: #fff;
                margin-left: auto;
            }

            .assistant-message {
                background: #3d3d3e;
                color: #fff;
            }

            .chat-input {
                padding: 16px;
                background: #2c2c2c;
                display: flex;
                gap: 8px;
                align-items: flex-end;
                border-top: 1px solid #3d3d3e;
            }

            .chat-input textarea {
                flex: 1;
                border: 1px solid #3d3d3e;
                background: #202124;
                color: #fff;
                padding: 8px 12px;
                border-radius: 8px;
                resize: none;
                min-height: 40px;
                max-height: 120px;
                font-family: inherit;
            }

            .chat-input button {
                background: #0b84ff;
                color: #fff;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                height: 40px;
            }

            .chat-input button:disabled {
                background: #3d3d3e;
                cursor: not-allowed;
            }

            .loading-indicator {
                position: absolute;
                bottom: 85px;
                left: 16px;
                background: #3d3d3e;
                padding: 8px 16px;
                border-radius: 12px;
            }

            .typing-indicator {
                display: flex;
                gap: 4px;
            }

            .typing-indicator span {
                width: 8px;
                height: 8px;
                background: #fff;
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out;
            }

            .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
            .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1); }
            }

            .chat-trigger-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #0b84ff;
                color: #fff;
                border: none;
                padding: 12px 24px;
                border-radius: 24px;
                cursor: pointer;
                font-weight: 500;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transition: transform 0.3s ease;
                z-index: 1000;
            }

            .chat-trigger-btn.hidden {
                transform: translateY(150%);
            }

        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Attach event listeners
    attachEventListeners() {
        const toggleBtn = this.container.querySelector('.toggle-chat-btn');
        const triggerBtn = this.container.querySelector('.chat-trigger-btn');
        const sendBtn = this.container.querySelector('#sendMessage');
        const input = this.container.querySelector('#messageInput');

        toggleBtn.addEventListener('click', () => this.toggleChat());
        triggerBtn.addEventListener('click', () => this.toggleChat());
        
        input.addEventListener('input', (e) => {
            this.autoResizeInput(e.target);
            sendBtn.disabled = !e.target.value.trim();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!sendBtn.disabled) {
                    this.sendMessage();
                }
            }
        });

        sendBtn.addEventListener('click', () => this.sendMessage());
    }

    // Auto-resize input
    autoResizeInput(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    // Toggle chat visibility
    toggleChat() {
        this.isChatVisible = !this.isChatVisible;
        const chat = this.container.querySelector('.dashboard-chat');
        const trigger = this.container.querySelector('.chat-trigger-btn');
        
        chat.classList.toggle('visible', this.isChatVisible);
        trigger.classList.toggle('hidden', this.isChatVisible);

        if (this.isChatVisible) {
            this.container.querySelector('#messageInput').focus();
        }
    }

    // Load conversation history
    loadConversationHistory() {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
            this.renderHistory();
        }
    }

    // Save conversation history
    saveConversationHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.conversationHistory));
    }

    // Render conversation history
    renderHistory() {
        const messagesContainer = this.container.querySelector('#chatMessages');
        messagesContainer.innerHTML = '';
        
        this.conversationHistory.forEach(msg => {
            this.renderMessage(msg.content, msg.role === 'user' ? 'user-message' : 'assistant-message');
        });
    }

    // Render a single message
    renderMessage(content, className) {
        const messagesContainer = this.container.querySelector('#chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show loading indicator
    showLoading() {
        this.container.querySelector('.loading-indicator').style.display = 'block';
        this.isWaitingForResponse = true;
    }

    // Hide loading indicator
    hideLoading() {
        this.container.querySelector('.loading-indicator').style.display = 'none';
        this.isWaitingForResponse = false;
    }

    // Send message to API
    async sendMessage() {
        if (this.isWaitingForResponse) {
            console.debug('[DashboardChat] Ignoring message - already waiting for response');
            return;
        }

        const input = this.container.querySelector('#messageInput');
        const message = input.value.trim();
        if (!message) {
            console.debug('[DashboardChat] Ignoring empty message');
            return;
        }

        // Clear input
        input.value = '';
        input.style.height = 'auto';
        input.dispatchEvent(new Event('input'));

        // Add user message to chat
        this.renderMessage(message, 'user-message');
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        try {
            this.showLoading();

            // Get latest dashboard state and prepare request
            const dashboardState = window.dashboardState || {};
            
            const requestData = {
                message,
                history: this.conversationHistory.slice(-10),
                erpContext: {
                    ...this.erpContext,
                    ...dashboardState,
                    timestamp: new Date().toISOString()
                }
            };

            console.log('[DashboardChat] Sending message to API:', {
                endpoint: this.API_ENDPOINT,
                messageLength: message.length,
                contextSize: JSON.stringify(requestData.erpContext).length
            });

            // Send to API
            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            console.log('[DashboardChat] API Response status:', response.status);

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            console.log('[DashboardChat] Starting response stream handling');
            
            // Handle streaming response
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';
            let chunkCount = 0;

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const text = decoder.decode(value);
                const lines = text.split('\n');
                chunkCount++;
                console.debug('[DashboardChat] Received chunk #' + chunkCount, {
                    size: value.length,
                    lines: lines.length
                });
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.error) throw new Error(data.error);
                            if (data.response) fullResponse += data.response;
                            if (data.done) break;
                        } catch (e) {
                            console.error('Error parsing SSE data:', e);
                        }
                    }
                }
            }

            // Add assistant response to chat
            this.renderMessage(fullResponse, 'assistant-message');
            this.conversationHistory.push({
                role: 'assistant',
                content: fullResponse
            });

            // Save updated history
            this.saveConversationHistory();

        } catch (error) {
            console.error('[DashboardChat] Error in message handling:', {
                error: error.message,
                endpoint: this.API_ENDPOINT,
                isNetworkError: error instanceof TypeError
            });
            this.renderMessage(
                'Sorry, there was an error processing your request. Please try again.',
                'assistant-message'
            );
        } finally {
            this.hideLoading();
        }
    }
}

// Export as ES module while maintaining global compatibility
export default DashboardChat;
if (typeof window !== 'undefined') {
    window.DashboardChat = DashboardChat;
}
