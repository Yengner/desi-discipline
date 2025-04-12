// Function to create and show the red button overlay
function showRedButton() {
    // Create the button element
    const button = document.createElement('button');
    button.textContent = '⚠️ Bad Website Detected';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ff4444;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

    // Add the button to the page
    document.body.appendChild(button);

    // Remove the button after 10 seconds
    setTimeout(() => {
        button.remove();
    }, 10000);
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showBadWebsiteWarning') {
        showRedButton();
    }
}); 