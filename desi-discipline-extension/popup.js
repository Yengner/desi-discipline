document.addEventListener('DOMContentLoaded', () => {
    updateTimeDisplay();
    
    // Add event listeners for buttons
    document.getElementById('addGoodSite').addEventListener('click', () => {
        addWebsite('good');
    });
    
    document.getElementById('addBadSite').addEventListener('click', () => {
        addWebsite('bad');
    });
    
    document.getElementById('viewStats').addEventListener('click', () => {
        viewStatistics();
    });
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("Message received in popup:", message);
        if (message.action === 'showAlert') {
            updateStatusDisplay(message.status, message.domain);
        }
    });

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        if (tabs[0] && tabs[0].url) {
            chrome.runtime.sendMessage({ action: "checkStatus", url: tabs[0].url });
        }
    });

    
});


// Update time display
function updateTimeDisplay() {
    chrome.storage.sync.get(['userData'], (result) => {
        const userData = result.userData || { productiveTime: 0, distractedTime: 0 };
        const productiveHours = Math.floor(userData.productiveTime / 60);
        const productiveMinutes = userData.productiveTime % 60;
        const distractedHours = Math.floor(userData.distractedTime / 60);
        const distractedMinutes = userData.distractedTime % 60;
        
        document.getElementById('productiveTime').textContent = 
            `${productiveHours}h ${productiveMinutes}m`;
        document.getElementById('distractedTime').textContent = 
            `${distractedHours}h ${distractedMinutes}m`;
    });
}

// Update status display
function updateStatusDisplay(status) {
    const statusDisplay = document.getElementById('statusDisplay');
    const statusButton = document.getElementById('statusButton');
    
    // Update status button
    statusButton.className = status;
    switch(status) {
        case 'good':
            statusButton.textContent = '✅ Productive Website';
            break;
        case 'bad':
            statusButton.textContent = '❌ Distracting Website';
            break;
        case 'maybe':
            statusButton.textContent = '⚠️ Website Status Unknown';
            break;
    }
    
    // Update status display
    statusDisplay.className = `status ${status}`;
}

// Add website to list
function addWebsite(type) {
    const url = prompt(`Enter the website domain to add to ${type} list:`);
    if (url) {
        chrome.storage.sync.get(['userData'], (result) => {
            const userData = result.userData;
            if (type === 'good') {
                userData.goodSites.push(url);
            } else {
                userData.badSites.push(url);
            }
            chrome.storage.sync.set({userData});
            alert(`Added ${url} to ${type} websites list`);
        });
    }
}

// View statistics
function viewStatistics() {
    chrome.storage.sync.get(['userData'], (result) => {
        const userData = result.userData;
        const totalTime = userData.productiveTime + userData.distractedTime;
        const productivityPercentage = (userData.productiveTime / totalTime * 100).toFixed(1);
        
        alert(`Productivity Statistics:\n
            Total Productive Time: ${Math.floor(userData.productiveTime / 60)}h ${userData.productiveTime % 60}m\n
            Total Distracted Time: ${Math.floor(userData.distractedTime / 60)}h ${userData.distractedTime % 60}m\n
            Productivity Rate: ${productivityPercentage}%`);
    });
} 