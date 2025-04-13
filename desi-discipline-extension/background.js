import { supabase, setAuthSession } from './supabaseClient.js';

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
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        if (tabs[0] && tabs[0].url) {
            checkWebsite(tabs[0].url);
        }
        else{
            if(lastCheckedUrl)
                {
                    testApiCall()
                    checkWebsite(lastCheckedUrl);
                    await fetchUserFocusSessions();
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
        showAlert('good', domain);
        return;
    }

    // Check if it's a bad site
    if (badSites.some(site => domain.includes(site))) {
        showAlert('bad', domain);
        // Send message to content script to show the red button
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'showBadWebsiteWarning' });
            }
        });
        return;
    }
}

function showAlert(status, domain) {
    // Check if the popup is open before sending the message
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

// background.js

// Function to retrieve stored token and call your API endpoint.
function testApiCall() {
    chrome.storage.sync.get("authToken", (data) => {
      const token = data.authToken;
      if (!token) {
        console.error("No auth token found. Please log in first.");
        return;
      }
  
      fetch("https://desi-discipline.vercel.app/api/extension", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(apiData => {
          console.log("API response from /api/extension:", apiData);
        })
        .catch(err => {
          console.error("Error calling API:", err);
        });
    });
  }
  
  // Optionally, test the API call when the extension icon is clicked.
  chrome.action.onClicked.addListener(() => {
    testApiCall();
  });
  
  // Listen for messages from the website to receive the auth token.
  chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.token) {
      // Store the token in chrome.storage
      chrome.storage.sync.set({ authToken: message.token, refreshToken: message.refresh_token }, () => {
        console.log("Auth token stored successfully!");
        sendResponse({ status: "success" });
      });
      // Return true to indicate an asynchronous response.
      return true;
    }
  });

  async function fetchUserFocusSessions() {
    chrome.storage.local.get(["authToken", "refreshToken"], async (data) => {
      const token = data.authToken;
      const refreshToken = data.refreshToken;
  
      if (!token || !refreshToken) {
        console.error("Missing token(s). Please log in first.");
        return;
      }
  
      // ✅ Set session (this mutates the shared supabase instance)
      const session = await setAuthSession(token, refreshToken);
      if (!session) {
        console.error("Failed to set session.");
        return;
      }
  
      // ✅ Reuse shared `supabase` instance (not from setAuthSession)
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Failed to get authenticated user:", userError);
        return;
      }
  
      const userId = userData.user.id;
      console.log("Authenticated user ID:", userId);
  
      const { data: sessions, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId); // assuming 'user_id' is the foreign key
  
      if (error) {
        console.error("Error fetching focus sessions:", error);
        return;
      }
  
      console.log("Focus sessions for user", userId, ":", sessions);
    });
  }