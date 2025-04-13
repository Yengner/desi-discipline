// Function to create and show the red button overlay
function showRedButton() {
    // Create the button element
    const button = document.createElement('button');
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #d8063e;
        color: white;
        padding: 20px 20px;
        border: none;
        border-radius: 5px;
        font-size: 30px;
        font-weight: bold;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: flex;
        flex-direction: column;
        align-items: center; 
    `;

    // Create the text node
    const text = document.createTextNode('⚠️ I didn’t raise you to do this. Focus on your work! ⚠️');


    // Create the GIF element
    const gif = document.createElement('img');
    gif.src = "https://piskel-imgstore-b.appspot.com/img/47ac1e33-181b-11f0-b353-373cf57b0682.gif";
    gif.alt = 'No No No!';
    gif.style.cssText = `
        width: auto;  /* Adjust the size of the GIF */
        height: 500px;
        margin-top: 5px;  /* Space between text and GIF */
    `;

    // Add the text and the GIF to the button
    button.appendChild(text);
    button.appendChild(gif);

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
