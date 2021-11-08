const WATCHED_PERCENTAGE_THRESHOLD = 0;
const VIDEO_AGE_THRESHOLD = 5;

const WATCHED_VIDEO_BAR_NODE_NAME = "YTD-THUMBNAIL-OVERLAY-RESUME-PLAYBACK-RENDERER";
const VIDEO_THUMBNAIL_NODE_NAME = "YTD-THUMBNAIL-OVERLAY-NOW-PLAYING-RENDERER";
const VIDEO_ELEMENT_NODE_NAME = "YTD-RICH-ITEM-RENDERER";
const YOUTUBE_HOME_VIDEO_ELEMENT_NODE_NAME = "YTD-RICH-ITEM-RENDERER";
const YOUTUBE_RELATED_VIDEO_ELEMENT_NODE_NAME = "YTD-COMPACT-VIDEO-RENDERER";
const YOUTUBE_MIX_PLAYLIST_ELEMENT_NODE_NAME = "YTD-THUMBNAIL-OVERLAY-BOTTOM-PANEL-RENDERER";

// callback function to execute when mutations are observed
const callback = function(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (isWatchedVideo(mutation.target)) {
                filterWatchedVideo(mutation.target);
            } else if (isOldVideo(mutation.target)) {
                filterOldVideo(mutation.target);
            } else if (isMixPlaylist(mutation.target)) {
                filterMixPlaylist(mutation.target);
            }
        }
    }
};

const isWatchedVideo = (target) => (target.nodeName === WATCHED_VIDEO_BAR_NODE_NAME);
const isOldVideo = (target) => (target.nodeName === VIDEO_ELEMENT_NODE_NAME || target.nodeName === VIDEO_THUMBNAIL_NODE_NAME);
const isMixPlaylist = (target) => (target.nodeName === YOUTUBE_MIX_PLAYLIST_ELEMENT_NODE_NAME);

const filterWatchedVideo = (element) => {
    const videoElement = element.closest(YOUTUBE_HOME_VIDEO_ELEMENT_NODE_NAME) || element.closest(YOUTUBE_RELATED_VIDEO_ELEMENT_NODE_NAME);
    const { watchedPercentage, videoMetadata, videoURL } = getVideoInformation(videoElement);
    if (watchedPercentage > WATCHED_PERCENTAGE_THRESHOLD) {
        console.log(`[Youtube Recommendations Filter] Removing watched video ${videoMetadata} from Recommendations (watched ${watchedPercentage}%). URL: ${videoURL}`);
        videoElement.style.setProperty("display", "none");
    } else {
        console.log(`[Youtube Recommendations Filter] NOT removing video ${videoMetadata}: only ${watchedPercentage}% watched, did not exceed ${WATCHED_PERCENTAGE_THRESHOLD}% threshold`);
    }
};

const filterOldVideo = (element) => {
    const videoElement = element.closest(YOUTUBE_HOME_VIDEO_ELEMENT_NODE_NAME) || element.closest(YOUTUBE_RELATED_VIDEO_ELEMENT_NODE_NAME);
    const { age, videoMetadata, videoURL } = getVideoInformation(videoElement);
    if (age > VIDEO_AGE_THRESHOLD) {
        console.log(`[Youtube Recommendations Filter] Removing old video ${videoMetadata} from Recommendations (age ${age} years old). URL: ${videoURL}`);
        videoElement.style.setProperty("display", "none");
    }
}

const filterMixPlaylist = (element) => {
    const videoElement = element.closest(YOUTUBE_HOME_VIDEO_ELEMENT_NODE_NAME) || element.closest(YOUTUBE_RELATED_VIDEO_ELEMENT_NODE_NAME);
    const { videoMetadata } = getVideoInformation(videoElement, true);
    console.log(`[Youtube Recommendations Filter] Removing mix playlist ${videoMetadata}`);
    videoElement.style.setProperty("display", "none");
}

const getWatchedPercentage = (videoElement) => {
    const progressBar = videoElement.querySelector("div#progress");
    if (progressBar) {
        return parseInt(progressBar.getAttribute("style").split("width: ").pop());
    }
};

const getVideoTitle = (videoElement) => {
    return videoElement.querySelector("#video-title").innerHTML.trim();
};

const getVideoAuthor = (videoElement) => {
    return (videoElement.querySelector("a.yt-formatted-string") || videoElement.querySelector("yt-formatted-string")).innerHTML;
};

const getVideoURL = (videoElement) => {
    return (videoElement.querySelector("a#video-title-link") || videoElement.querySelector("a")).href;
};

const getVideoAge = (videoElement) => {
    const metadataBlock = videoElement.querySelectorAll("span.ytd-video-meta-block");
    if (metadataBlock && metadataBlock.length > 1) {
        const [ ageStr, unit ] = metadataBlock[1].innerHTML.split(" ");
        const age = parseInt(ageStr);
        if (unit.includes("year")) {
            return age;
        }
        return 0; // day(s), hour(s), month(s), etc. all <1 year, return 0
    }
};

const getVideoInformation = (videoElement, isMix) => {
    return {
        watchedPercentage: getWatchedPercentage(videoElement),
        videoMetadata: `"${getVideoTitle(videoElement)}"${!isMix ? ` by ${getVideoAuthor(videoElement)}` : "" }`,
        videoURL: getVideoURL(videoElement),
        age: getVideoAge(videoElement),
    }
};

// create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// get the container for all the recommended videos
const videosGrid = document.querySelector("ytd-rich-grid-renderer > div#contents") ||
    document.querySelector("div#related div#contents");

// start observing the target node for configured mutations
observer.observe(videosGrid, { childList: true, subtree: true });
console.log("[Youtube Recommendations Filter] Hiding watched & old YouTube videos from Recommended...");
