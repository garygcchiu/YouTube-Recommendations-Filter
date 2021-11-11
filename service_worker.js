chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo) {
        // send the new url to content_scripts.js iff it is a youtube navigation
        if (changeInfo.url && changeInfo.url.includes("youtube.com")) {
            chrome.tabs.sendMessage( tabId, {
                message: 'New YouTube Navigation',
                url: changeInfo.url
            })
        }
    }
);
