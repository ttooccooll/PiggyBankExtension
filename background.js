// Background script for PiggyBank Extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('PiggyBank extension installed');
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getAlbyStatus') {
    // Check if Alby is available
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'checkAlbyConnection' }, (response) => {
        sendResponse({ connected: !!response?.connected });
      });
    });
    return true; // Keep the message channel open for async response
  }
});