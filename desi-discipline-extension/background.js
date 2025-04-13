import { supabase, setAuthSession } from './supabaseClient.js';

// Hardcoded lists of good and bad websites
const apiKey = "AIzaSyDh3NUB6h470ctpwgT9bT57yeReQuigio8";

//Get api to get good sites and set
// const goodSites = [
//     'canvas.com',
//     'calendar.google.com',
//     'docs.google.com',
//     'drive.google.com',
//     'classroom.google.com',
//     'github.com',
//     'stackoverflow.com',
//     'w3schools.com',
//     'leetcode.com',
//     'codecademy.com'
// ];

// //Get api to get bad sites
// const badSites = [
//     'instagram.com',
//     'netflix.com',
//     'facebook.com',
//     'twitter.com',
//     'tiktok.com',
//     'reddit.com',
//     'pinterest.com',
//     'snapchat.com',
//     'youtube.com/watch',
//     'twitch.tv'
// ];

let lastCheckedUrl = '';
let isSessionInitialized = false;


// Fetch user focus sessions
chrome.runtime.onStartup.addListener(() => {
    fetchUserFocusSessions(); 
  });

// setInterval(() => {
//     chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         if (tabs[0] && tabs[0].url) {
//             checkWebsite(tabs[0].url);
//         }
//         else{
//             if(lastCheckedUrl)
//                 {
//                     checkWebsite(lastCheckedUrl);
//                 }
//             }
//     });
// }, 1000);


setInterval(() => {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
        if (tabs[0] && tabs[0].url) {
            checkWebsite(tabs[0].url);
        }
        else{
            if(lastCheckedUrl)
                {
                    checkWebsite(lastCheckedUrl);
                    await fetchUserFocusSessions();
                    
                }
            }
    });
}, 2000);

// Check when a tab is activated
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url) checkWebsite(tab.url);
    });
});

// Check when a tab is updated (like navigating to a different page)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active && tab.url) {
        checkWebsite(tab.url);
    }
});

/// Check website status
function checkWebsite(url) {
    if (!url) return;

    try {
        const domain = new URL(url).hostname;
        const path = new URL(url).pathname;
        const href = new URL(url).href;

        lastCheckedUrl = url;

        // Skip unsupported schemes
        if (href.startsWith("chrome://") || href.startsWith("about:") || href.startsWith("edge://")) {
            console.warn(`Skipping unsupported URL: ${href}`);
            return;
        }

        // Check if it's a good site
        if (goodSites.some(site => domain.includes(site))) {
            showAlert('good', domain);
            return;
        } else if (badSites.some(site => domain.includes(site))) {
            showAlert('bad', domain);
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'showBadWebsiteWarning' });
                }
            });
            return;
        }
        // } else {
        //     checkWithGemini(href).then(results => {
        //         if ((results + "").toLowerCase().includes("bad")) {
        //             showAlert('bad', domain);
        //             chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        //                 if (tabs[0]) {
        //                     chrome.tabs.sendMessage(tabs[0].id, { action: 'showBadWebsiteWarning' });
        //                 }
        //             });
        //         } else {
        //             showAlert('good', domain);
        //         }
        //     }).catch(error => {
        //         console.error('Error checking with Gemini:', error);
        //     });
        // }

        console.log("🌐 Site not in list – treating as ALLOWED:", domain);
        showAlert('good', domain);

    } catch (err) {
        console.error('Error in checkWebsite:', err);
    }
}

// Call Gemini to analyze the page
async function checkWithGemini(href) {
    try {
        const response = await fetch(href);
        const html = await response.text();
        const bodyText = extractTextFromHTML(html);

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Only output the words 'good' or 'bad'. Your job is to tell if a website is good for studying or bad for studying by analysing the data I'm about to provide. The data added below is the data from the website I've webscraped: ${bodyText}`
                        }]
                    }]
                })
            }
        );

        const data = await geminiResponse.json();
        console.log("PLEASE FOR THE LOVE OF GOD");
        console.log(data);
        console.log(data.candidates?.[0]?.content?.parts?.[0]?.text);
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (err) {
        console.error('Error in checkWithGemini:', err);
        return "good"; // Default fallback if Gemini check fails
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

function extractTextFromHTML(html) {
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<[^>]+>/g, '') // Remove all tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
}

// background.js
  
  // Listen for messages from the website to receive the auth token.
  chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    if (message.token) {
      // Store the token in chrome.storage
      chrome.storage.local.set({ authToken: message.token, refreshToken: message.refresh_token }, () => {
        console.log("Auth token stored successfully!");
        sendResponse({ status: "success" });
      });
      // Return true to indicate an asynchronous response.
      return true;
    }
  });

  // Fetch user focus sessions
  async function fetchUserFocusSessions() {
    if (isSessionInitialized) return; // prevent re-auth

    chrome.storage.local.get(["authToken", "refreshToken"], async (data) => {
      const token = data.authToken;
      const refreshToken = data.refreshToken;
  
      if (!token || !refreshToken) {
        console.error("Missing token(s). Please log in first.");
        return;
      }
  
      const session = await setAuthSession(token, refreshToken);
      if (!session) {
        console.error("Failed to set session.");
        return;
      }
  
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Failed to get authenticated user:", userError);
        return;
      }
  
      const userId = userData.user.id;
      console.log("Authenticated user ID:", userId);

        // Fetch the site lists
        
        const { data: sessions, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId); 
        
        if (error) {
            console.error("Error fetching focus sessions:", error);
            return;
        }
        console.log("Focus sessions for user", userId, ":", sessions);
        isSessionInitialized = true; 

        
        await fetchSiteLists(userId);
    });
  }


  // Fetch the site lists when the extension is loaded
  let goodSites = [];
  let badSites = [];
  
  async function fetchSiteLists(userId) {
    const { data: globalSites, error: siteError } = await supabase
      .from("sites")
      .select("site_id, domain, category");
  
    const { data: overrides, error: overrideError } = await supabase
      .from("user_site_settings")
      .select("site_id, override_type")
      .eq("user_id", userId);
  
    if (siteError) {
      console.error("Error loading global site list:", siteError);
      return;
    }
  
    if (overrideError) {
      console.error("Error loading user overrides:", overrideError);
      return;
    }
    console.log("Global sites from DB:", globalSites);
    console.log("User overrides from DB:", overrides);
  
    // Map overrides for quick lookup
    const overrideMap = {};
    overrides.forEach(o => {
      overrideMap[o.site_id] = o.override_type;
    });
  
    // ✅ Clear lists first
    goodSites = [];
    badSites = [];
  
    // ✅ Loop through and push into correct arrays
    globalSites.forEach(site => {
      const finalType = overrideMap[site.site_id] || site.category;
      if (finalType === 'allowed') {
        goodSites.push(site.domain);
      } else if (finalType === 'distraction') {
        badSites.push(site.domain);
      }
    });
  
    console.log("✅ Good Sites:", goodSites);
    console.log("🚫 Bad Sites:", badSites);
  }