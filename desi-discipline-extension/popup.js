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
    chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
        const url = tabs[0].url;
        const domain = new URL(url).hostname;
      
        const { authToken } = await new Promise(resolve => {
          chrome.storage.local.get(["authToken"], resolve);
        });
      
        const response = await fetch("https://desi-discipline.vercel.app/api/add-site-override", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({
            domain,
            override_type: type === 'good' ? 'allowed' : 'distraction'
          })
        });
      
        const result = await response.json();
        if (result.success) {
          alert("✅ Site saved!");
        } else {
          console.error("❌ Failed to save:", result.error);
          alert("❌ Error saving site.");
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