const DEFAULT_WATCHED_THRESHOLD = 0;
const DEFAULT_AGE_THRESHOLD = 5;
const DEFAULT_FILTER_MIX_PLAYLISTS = true;

let videoWatchedThreshold = DEFAULT_WATCHED_THRESHOLD;
let videoAgeThreshold = DEFAULT_AGE_THRESHOLD;
let shouldFilterMixPlaylists = DEFAULT_FILTER_MIX_PLAYLISTS;

// callback function to execute when mutations are observed
const callback = function(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (isMixPlaylist(mutation.target) && shouldFilterMixPlaylists) {
                filterMixPlaylist(mutation.target);
            } else if (isWatchedVideo(mutation.target)) {
                filterWatchedVideo(mutation.target);
            } else if (isOldVideo(mutation.target)) {
                filterOldVideo(mutation.target);
            }
        }
    }
};

// load settings from storage
chrome.storage.sync.get("watchedThreshold", ({ watchedThreshold }) => {
    if (watchedThreshold === undefined) {
        console.log(`[Youtube Recommendations Filter] Using default video watched threshold = ${videoWatchedThreshold}%`);
        return;
    }
    console.log(`[Youtube Recommendations Filter] Loaded video watched threshold = ${watchedThreshold}%`);
    if (watchedThreshold) {
        videoWatchedThreshold = watchedThreshold;
    }
});

chrome.storage.sync.get("ageThreshold", ({ ageThreshold }) => {
    if (ageThreshold === undefined) {
        console.log(`[Youtube Recommendations Filter] Using default video age threshold = ${videoAgeThreshold}%`);
        return;
    }
    console.log(`[Youtube Recommendations Filter] Loaded video age threshold = ${ageThreshold} years old`);
    if (ageThreshold) {
        videoAgeThreshold = ageThreshold;
    }
});

chrome.storage.sync.get("filterMixPlaylists", ({ filterMixPlaylists }) => {
    // if undefined, use default value, otherwise use setting from storage
    shouldFilterMixPlaylists = filterMixPlaylists === undefined ? shouldFilterMixPlaylists : filterMixPlaylists;
    console.log(`[Youtube Recommendations Filter] Loaded filter mix playlists = ${shouldFilterMixPlaylists ? "enabled" : "disabled"}`);
});

const filterWatchedVideo = (element) => {
    const videoElement = getVideoElement(element);
    if (videoElement) {
        const { watchedPercentage, videoMetadata, videoURL } = getVideoInformation(videoElement);
        if (watchedPercentage > videoWatchedThreshold) {
            console.log(`[Youtube Recommendations Filter] Removing watched video ${videoMetadata} from Recommendations (watched ${watchedPercentage}%). URL: ${videoURL}`);
            videoElement.style.setProperty("display", "none"); // removing from DOM causes a lot of problems when new Recommendations are loaded
        }
    }
};

const filterOldVideo = (element) => {
    const videoElement = getVideoElement(element);
    if (videoElement) {
        const { age, videoMetadata, videoURL } = getVideoInformation(videoElement);
        if (age > videoAgeThreshold) {
            console.log(`[Youtube Recommendations Filter] Removing old video ${videoMetadata} from Recommendations (age ${age} years old). URL: ${videoURL}`);
            videoElement.style.setProperty("display", "none");
        }
    }
}

const filterMixPlaylist = (element) => {
    const videoElement = getVideoElement(element);
    const { videoMetadata } = getVideoInformation(videoElement, true);
    console.log(`[Youtube Recommendations Filter] Removing mix playlist ${videoMetadata}`);
    videoElement.style.setProperty("display", "none");
}

// create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// start observer
observer.observe(getContentRoot(), { childList: true, subtree: true });
console.log("[Youtube Recommendations Filter] Hiding watched & old YouTube videos from Recommended...");
