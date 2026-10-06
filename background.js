chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({ url: 'chrome://extensions/?id=' + chrome.runtime.id });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'log') {
        console.log('Extension Log:', request.data);
    }
});
