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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0].url;
        console.log("Current URL:", url);
        if (url) {
            const endpoint = type === 'good' ? 'https://your-backend.com/api/good' : 'https://your-backend.com/api/bad';
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: url })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }


      });

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