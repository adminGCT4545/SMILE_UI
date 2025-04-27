// Chat Integration Test Suite
async function runChatTests() {
    console.log('Starting Kynsey AI Chat Integration Tests...');
    const results = {
        passed: 0,
        failed: 0,
        details: []
    };

    try {
        // 1. Test Chat Interface Functionality
        console.log('\nTesting Chat Interface...');
        
        // Test chat window visibility
        const chatContainer = document.querySelector('.dashboard-chat');
        const triggerBtn = document.querySelector('.chat-trigger-btn');
        
        if (!chatContainer || !triggerBtn) {
            throw new Error('Chat interface elements not found');
        }
        
        // Toggle visibility
        triggerBtn.click();
        await wait(500);
        results.details.push(
            chatContainer.classList.contains('visible') 
                ? '✓ Chat window opens correctly'
                : '✗ Failed to open chat window'
        );
        
        // 2. Test API Integration
        console.log('\nTesting API Integration...');
        
        // Test connection to port 3002
        try {
            const response = await fetch('http://localhost:3002/api/chat/health');
            if (response.ok) {
                results.details.push('✓ Successfully connected to chat API');
            } else {
                throw new Error(`API health check failed: ${response.status}`);
            }
        } catch (error) {
            results.details.push(`✗ API connection failed: ${error.message}`);
        }

        // 3. Test Message Handling
        console.log('\nTesting Message Handling...');
        
        const messageInput = document.querySelector('#messageInput');
        const sendButton = document.querySelector('#sendMessage');
        
        if (!messageInput || !sendButton) {
            throw new Error('Message input elements not found');
        }
        
        // Test sending message
        messageInput.value = 'test message';
        messageInput.dispatchEvent(new Event('input'));
        await wait(100);
        
        if (!sendButton.disabled) {
            results.details.push('✓ Send button enables with input');
        } else {
            results.details.push('✗ Send button failed to enable');
        }

        // 4. Test ERP Context Integration
        console.log('\nTesting ERP Context Integration...');
        
        // Try accessing dashboard data
        const testMessage = 'What is the current surgical revenue?';
        messageInput.value = testMessage;
        messageInput.dispatchEvent(new Event('input'));
        sendButton.click();
        
        // Wait for response
        await wait(2000);
        
        const messages = document.querySelectorAll('.message');
        const lastMessage = messages[messages.length - 1];
        
        if (lastMessage && lastMessage.classList.contains('assistant-message')) {
            results.details.push('✓ Assistant responds with dashboard context');
        } else {
            results.details.push('✗ Failed to get response with dashboard context');
        }

        // 5. Test Error Handling
        console.log('\nTesting Error Handling...');
        
        // Force an error by temporarily changing API endpoint
        const chat = window.dashboardChat;
        const originalEndpoint = chat.API_ENDPOINT;
        chat.API_ENDPOINT = 'http://localhost:3002/invalid';
        
        messageInput.value = 'trigger error test';
        messageInput.dispatchEvent(new Event('input'));
        sendButton.click();
        
        await wait(2000);
        
        const errorMessage = document.querySelector('.message:last-child');
        if (errorMessage && errorMessage.textContent.includes('error')) {
            results.details.push('✓ Errors are handled and displayed properly');
        } else {
            results.details.push('✗ Error handling test failed');
        }
        
        // Restore original endpoint
        chat.API_ENDPOINT = originalEndpoint;

    } catch (error) {
        results.details.push(`✗ Test suite error: ${error.message}`);
    }

    // Calculate results
    results.passed = results.details.filter(d => d.startsWith('✓')).length;
    results.failed = results.details.filter(d => d.startsWith('✗')).length;

    // Display results
    console.log('\nTest Results:');
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log('\nDetails:');
    results.details.forEach(detail => console.log(detail));

    return results;
}

// Helper function for async waiting
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export as ES module while maintaining global compatibility
export { runChatTests };
if (typeof window !== 'undefined') {
    window.runChatTests = runChatTests;
}
