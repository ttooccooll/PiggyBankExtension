// Content script for PiggyBank Extension

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'checkAlbyConnection') {
    // Check if window.alby is available
    const connected = !!window.alby;
    sendResponse({ connected });
  }
  return true;
});

// Send messages to the webpage
window.addEventListener('message', (event) => {
  // Only accept messages from the same frame
  if (event.source !== window) return;

  if (event.data.type && event.data.type === 'FROM_PAGE') {
    // Forward to extension
    chrome.runtime.sendMessage(event.data);
  }
});