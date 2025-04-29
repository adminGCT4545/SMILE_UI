import React from 'react';

/**
 * @typedef {Object} KynseyAIChatOptions
 * @property {string} [containerId] - ID for the chat container element
 */

/**
 * Bridge between React and vanilla JS chat implementation
 * @class
 */
export default class KynseyAIChatBridge {
    /** @type {DashboardChat|null} */
    chat;
    /** @type {Function|null} */
    onStateChange;
    /** @type {string} */
    containerId;
    /** @type {number} */
    retryAttempts;
    /** @type {number} */
    retryDelay;

    constructor(options = { containerId: 'kynsey-ai-chat-container' }) {
        this.chat = null;
        this.onStateChange = null;
        this.containerId = options.containerId;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    /**
     * Initialize chat with container ID and state change callback
     * @param {string} containerId - DOM container ID for chat
     * @param {Function} onStateChange - Callback for visibility changes
     * @returns {Promise<void>}
     */
    async init(containerId, onStateChange) {
        try {
            console.log('[KynseyAIChatBridge] Initializing chat bridge', { containerId });
            this.containerId = containerId;
            this.onStateChange = onStateChange;
            
            // Create container for vanilla JS chat
            const container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);

            // Initialize chat with retries
            for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
                try {
                    this.chat = new DashboardChat();
                    await this.chat.init(this.containerId);
                    console.log('[KynseyAIChatBridge] Chat initialized successfully');
                    
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
                    
                    break;
                } catch (error) {
                    console.error(`[KynseyAIChatBridge] Attempt ${attempt} failed:`, error);
                    if (attempt === this.retryAttempts) {
                        throw new Error(`Failed to initialize chat after ${this.retryAttempts} attempts: ${error.message}`);
                    }
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
                }
            }
        } catch (error) {
            console.error('[KynseyAIChatBridge] Fatal initialization error:', error);
            this.cleanup();
            throw error;
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        try {
            console.log('[KynseyAIChatBridge] Cleaning up resources');
            this.cleanup();
        } catch (error) {
            console.error('[KynseyAIChatBridge] Error during cleanup:', error);
        }
    }

    /**
     * Internal cleanup helper
     * @private
     */
    cleanup() {
        if (this.chat) {
            this.close();
            this.chat = null;
        }
        
        const container = document.getElementById(this.containerId);
        if (container) {
            container.remove();
        }
    }

    /**
     * Open the chat interface
     */
    open() {
        if (this.chat && !this.chat.isChatVisible) {
            this.chat.toggleChat();
        }
    }

    /**
     * Close the chat interface
     */
    close() {
        if (this.chat && this.chat.isChatVisible) {
            this.chat.toggleChat();
        }
    }
}

// React hook for using the chat bridge
/**
 * React hook for using the chat bridge
 * @returns {{
 *   isVisible: boolean,
 *   openChat: () => void,
 *   closeChat: () => void
 * }}
 */
export function useKynseyAIChat() {
    const chatRef = React.useRef(/** @type {KynseyAIChatBridge | null} */ (null));
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
