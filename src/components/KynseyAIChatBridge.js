/* global React, PropTypes */
// Bridge between React and vanilla JS chat implementation
class KynseyAIChatBridge {
    static propTypes = {
        onStateChange: PropTypes.func,
        containerId: PropTypes.string
    };

    constructor(options = { containerId: 'kynsey-ai-chat-container' }) {
        this.chat = null;
        this.onStateChange = null;
    }

    // Initialize chat with container ID and state change callback
    init(containerId, onStateChange) {
        console.log('[KynseyAIChatBridge] Initializing chat bridge', { containerId });
        this.onStateChange = onStateChange;
        
        // Create container for vanilla JS chat
        const container = document.createElement('div');
        container.id = containerId;
        document.body.appendChild(container);

        // Initialize chat
        this.chat = new DashboardChat();
        this.chat.init(containerId).catch(error => {
            console.error('[KynseyAIChatBridge] Failed to initialize chat:', error);
        });

        // Override toggleChat to sync with React state
        const originalToggle = this.chat.toggleChat;
        this.chat.toggleChat = () => {
            console.debug('[KynseyAIChatBridge] Toggle chat visibility');
            originalToggle.call(this.chat);
            if (this.onStateChange) {
                console.debug('[KynseyAIChatBridge] Syncing React state:', this.chat.isChatVisible);
                this.onStateChange(this.chat.isChatVisible);
            }
        };
    }

    // Clean up
    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.remove();
        }
    }

    // Control methods
    open() {
        if (this.chat && !this.chat.isChatVisible) {
            this.chat.toggleChat();
        }
    }

    close() {
        if (this.chat && this.chat.isChatVisible) {
            this.chat.toggleChat();
        }
    }
}

// React hook for using the chat bridge
function useKynseyAIChat() {
    const chatRef = React.useRef(null);
    const [isVisible, setIsVisible] = React.useState(false);
    const containerId = 'kynsey-ai-chat-container';

    React.useEffect(() => {
        console.log('[KynseyAIChatBridge] Setting up React hook');
        
        // Initialize chat bridge
        chatRef.current = new KynseyAIChatBridge();
        chatRef.current.init(containerId, (visible) => {
            console.debug('[KynseyAIChatBridge] Visibility changed:', visible);
            setIsVisible(visible);
        });

        // Cleanup on unmount
        return () => {
            console.log('[KynseyAIChatBridge] Cleaning up chat bridge');
            if (chatRef.current) {
                chatRef.current.destroy();
            }
        };
    }, []);

    return {
        isVisible,
        openChat: () => chatRef.current?.open(),
        closeChat: () => chatRef.current?.close()
    };
}

// Export as ES module while maintaining global compatibility
export { KynseyAIChatBridge as default, useKynseyAIChat };
if (typeof window !== 'undefined') {
    window.KynseyAIChatBridge = KynseyAIChatBridge;
    window.useKynseyAIChat = useKynseyAIChat;
}
