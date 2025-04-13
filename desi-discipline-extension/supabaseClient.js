// supabaseClient.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your actual Supabase URL and anon key.
const SUPABASE_URL = 'https://ptfykqxsrbzmeuwunrfd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0ZnlrcXhzcmJ6bWV1d3VucmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0ODM3ODQsImV4cCI6MjA2MDA1OTc4NH0.tRC3MFQwCCiT5OZnTx7ZyEZU-W8dDEoREx0LXYeaiC8';

const chromeStorageAdapter = {
    getItem: async (key) => {
      const result = await chrome.storage.local.get(key);
      return result[key] ?? null;
    },
    setItem: async (key, value) => {
      await chrome.storage.local.set({ [key]: value });
    },
    removeItem: async (key) => {
      await chrome.storage.local.remove(key);
    },
  };
  
  // ✅ Create once and reuse — do NOT recreate in every function
  export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storage: chromeStorageAdapter,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
  
  /**
   * ✅ Set auth session when you receive tokens (e.g., from popup or web)
   */
  export async function setAuthSession(access_token, refresh_token) {
    if (!access_token || !refresh_token) {
      throw new Error("Both access_token and refresh_token are required.");
    }
  
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
  
    if (error) {
      console.error("Failed to set session:", error.message);
      return null;
    }
  
    console.log("Session set successfully:", data.session);
    return data.session;
  }
  
  /**
   * ✅ Get current authenticated user
   */
  export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error getting user:", error.message);
      return null;
    }
    return data.user;
  }