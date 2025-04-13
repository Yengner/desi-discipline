// Keep track of the interval so we don’t create duplicates
let soundIntervalId = null;

// Function to create and show the red button overlay
function showRedButton() {
    // If there's already an interval running, do nothing
    if (soundIntervalId !== null) {
        return;
    }

    // Create the button element
    const button = document.createElement('button');
    button.id = 'focusRedButton'; // Assign an ID for easy removal
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
        width: auto;
        height: 500px;
        margin-top: 5px;
    `;

    button.appendChild(text);
    button.appendChild(gif);
    document.body.appendChild(button);

    // Function to play the sound
    const playSound = () => {
        const sound = new Audio(chrome.runtime.getURL('buzzer-or-wrong-answer-20582.mp3'));
        sound.play();
    };

    // Play once right away
    playSound();

    // Then every 2 minutes
    soundIntervalId = setInterval(playSound, 5 * 60 * 1000); // 120000 ms

    // Stop playing after 30 mins
    setTimeout(() => {
        clearInterval(soundIntervalId);
        soundIntervalId = null;
    }, 30 * 60 * 1000); // 1800000 ms
}

// Function to remove the red button overlay and stop the sound
// Function to remove the red button overlay and stop the sound
function clearRedButton() {
    const clearIntervalCheck = setInterval(() => {
        const existingButton = document.getElementById('focusRedButton');
        if (existingButton) {
            existingButton.remove();
        }

        if (soundIntervalId !== null) {
            clearInterval(soundIntervalId);
            soundIntervalId = null;
        }

        // If nothing to clear anymore, stop checking
        if (!existingButton && soundIntervalId === null) {
            clearInterval(clearIntervalCheck);
        }
    }, 1000); // every second
}


// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'showBadWebsiteWarning') {
        showRedButton();
    } else if (message.action === 'clearRedButton') {
        clearRedButton();
    }
});
