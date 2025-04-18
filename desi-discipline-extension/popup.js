let isStudying = false;
let studyStartTime = null;
let studyInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    chrome.storage.local.get(["authToken"], ({ authToken }) => {
        if (!authToken) {
          // 🚪 No user is logged in
          document.getElementById("authSection").style.display = "block";
        } else {
          // 🔐 User is logged in
          document.getElementById("mainApp").style.display = "block";
          initMainApp(); // your existing logic lives here
        }
      });

    // Setup login events
      setupLoginEvents();

    const studyBtn = document.getElementById('studyToggleBtn');

    // Insert timer display
    const studyTimerDisplay = document.createElement('div');
    studyTimerDisplay.id = 'studyTimer';
    studyTimerDisplay.style.textAlign = 'center';
    studyTimerDisplay.style.marginTop = '5px';
    studyBtn.insertAdjacentElement('afterend', studyTimerDisplay);
  
    // Restore timer if session is active
    chrome.storage.local.get(['isStudying', 'studyStartTime'], (result) => {
      if (result.isStudying && result.studyStartTime) {
        isStudying = true;
        studyStartTime = new Date(result.studyStartTime);
  
        studyBtn.textContent = 'Stop Studying';
        studyBtn.classList.remove('good');
        studyBtn.classList.add('bad');
  
        studyInterval = setInterval(() => {
          const elapsed = Math.floor((new Date() - studyStartTime) / 1000);
          const minutes = Math.floor(elapsed / 60);
          const seconds = elapsed % 60;
          document.getElementById('studyTimer').textContent = `⏱️ Studying for ${minutes}m ${seconds}s`;
        }, 1000);
      }
    });
  

    // ✅ Add event listener to start/stop studying
    studyBtn.addEventListener('click', () => {
        if (!isStudying) {
        startStudying();
        } else {
        stopStudying();
        }
    });
    ;
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
async function updateTimeDisplay() {
    const { authToken } = await new Promise(resolve =>
      chrome.storage.local.get(["authToken"], resolve)
    );
  
    if (!authToken) return;
  
    try {
      const response = await fetch("https://desi-discipline.vercel.app/api/daily-summary", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
  
      const data = await response.json();
  
      if (!data || data.error) {
        console.error("Failed to fetch daily stats:", data?.error);
        return;
      }
  
      const totalSeconds = data.productive ?? 0;

      const pH = Math.floor(totalSeconds / 3600);
      const pM = Math.floor((totalSeconds % 3600) / 60);
      const pS = totalSeconds % 60;
  
      document.getElementById("productiveTime").textContent = `${pH}h ${pM}m ${pS}s`;
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
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

function startStudying() {
    isStudying = true;
    studyStartTime = new Date();

    chrome.storage.local.set({
        isStudying: true,
        studyStartTime: studyStartTime.toISOString()
      });


    const studyBtn = document.getElementById('studyToggleBtn');
    studyBtn.textContent = 'Stop Studying';
    studyBtn.classList.remove('good');
    studyBtn.classList.add('bad');
  
    studyInterval = setInterval(() => {
      const elapsed = Math.floor((new Date() - studyStartTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      document.getElementById('studyTimer').textContent = `⏱️ Studying for ${minutes}m ${seconds}s`;
    }, 1000);
  }
  
  async function stopStudying() {

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "clearRedButton" });
      });


    isStudying = false;
    clearInterval(studyInterval);
    chrome.storage.local.remove(['isStudying', 'studyStartTime']);
  
    const studyBtn = document.getElementById('studyToggleBtn');
    studyBtn.textContent = 'Start Studying';
    studyBtn.classList.remove('bad');
    studyBtn.classList.add('good');
    document.getElementById('studyTimer').textContent = '';
  
    const endTime = new Date();
    const totalSeconds = Math.floor((endTime - studyStartTime) / 1000);
  
    const { authToken } = await new Promise(resolve => {
      chrome.storage.local.get(['authToken'], resolve);
    });
  
    if (!authToken) {
      alert("You're not logged in.");
      return;
    }
  
    const response = await fetch("https://desi-discipline.vercel.app/api/log-focus-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        start_time: studyStartTime.toISOString(),
        end_time: endTime.toISOString(),
        total_seconds: totalSeconds
      })
    });
  
    const result = await response.json();
    if (result.success) {
      alert(`✅ Study session logged: ${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`);
    } else {
      console.error(result.error);
      alert("❌ Failed to log session.");
    }
  
    studyStartTime = null;
  }

  function setupLoginEvents() {
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupRedirectBtn");
  
    if (loginBtn) {
      loginBtn.addEventListener("click", handleLogin);
    }
  
    if (signupBtn) {
      signupBtn.addEventListener("click", redirectToSignup);
    }
  }

  async function handleLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    if (!email || !password) {
      return alert("Please enter both email and password.");
    }
  
    try {
      const response = await fetch("https://desi-discipline.vercel.app/api/extension-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (!data.success) {
        return alert("❌ Login failed: " + data.error);
      }
  
      const { access_token, refresh_token } = data;
      chrome.storage.local.set({ authToken: access_token, refreshToken: refresh_token }, () => {
        location.reload(); // reload popup with new session
      });
    } catch (err) {
      console.error(err);
      alert("❌ Login failed. Please try again.");
    }
  }
  
  function redirectToSignup() {
    chrome.tabs.create({ url: "https://desi-discipline.vercel.app/sign-up" });
  }