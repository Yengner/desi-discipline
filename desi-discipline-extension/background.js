// Hardcoded lists of good and bad websites
const goodSites = [
    'canvas.com',
    'calendar.google.com',
    'docs.google.com',
    'drive.google.com',
    'classroom.google.com',
    'github.com',
    'stackoverflow.com',
    'w3schools.com',
    'leetcode.com',
    'codecademy.com'
];

const badSites = [
    'instagram.com',
    'netflix.com',
    'facebook.com',
    'twitter.com',
    'tiktok.com',
    'reddit.com',
    'pinterest.com',
    'snapchat.com',
    'youtube.com/watch',
    'twitch.tv'
];

let lastCheckedUrl = '';

setInterval(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0] && tabs[0].url) {
            checkWebsite(tabs[0].url);
        }
        else{
            if(lastCheckedUrl)
                {
                    checkWebsite(lastCheckedUrl);
                }
            }
    });
}, 1000);

// Check website status
function checkWebsite(url) {
    if (!url) return;
    
    lastCheckedUrl = url;
    const domain = new URL(url).hostname;
    const path = new URL(url).pathname;

    // Check if it's a good site
    if (goodSites.some(site => domain.includes(site))) {
        console.log("2.5");

        showAlert('good', domain);
        return;
    }

    // Check if it's a bad site
    if (badSites.some(site => domain.includes(site))) {
        showAlert('bad', domain);
        return;
    }
}

function showAlert(status, domain) {
    // Check if the popup is open before sending the message
    console.log("trefakhsdfsh");
    chrome.runtime.sendMessage({ action: "showAlert", status: status, domain: domain})
        .catch(error => {
            // Ignore the error if the popup is not open (Receiving end does not exist)
            if (error.message.includes('Receiving end does not exist')) {
                console.log('Popup is not open, skipping message');
                return;
            }
            console.error('Error sending message:', error);
        });
}