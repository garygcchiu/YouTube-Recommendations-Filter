const WATCHED_PERCENTAGE_THRESHOLD = 0;
const WATCHED_VIDEO_BAR_NODE_NAME = "YTD-THUMBNAIL-OVERLAY-RESUME-PLAYBACK-RENDERER";
const YOUTUBE_VIDEO_ELEMENT_NODE_NAME = "YTD-RICH-ITEM-RENDERER";
// const HIDDEN_VIDEOS_STORAGE_KEY = 'hidden-watched-yt-videos';

// callback function to execute when mutations are observed
const callback = function(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (mutation.target.nodeName === WATCHED_VIDEO_BAR_NODE_NAME) {
                const videoElement = mutation.target.closest(YOUTUBE_VIDEO_ELEMENT_NODE_NAME);
                const { watchedPercentage, videoMetadata, videoURL } = getVideoInformation(videoElement);
                if (watchedPercentage > WATCHED_PERCENTAGE_THRESHOLD) {
                    console.log(`Removing watched video ${videoMetadata} from Recommendations (watched ${watchedPercentage}%). URL: ${videoURL}`);
                    // remove video
                    videoElement.parentElement.removeChild(videoElement);
                } else {
                    console.log(`NOT removing video ${videoMetadata}: only ${watchedPercentage}% watched, did not exceed ${WATCHED_PERCENTAGE_THRESHOLD}% threshold`);
                }
            }
        }
    }
};

// create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// get the container for all the recommended videos
const videosGrid = document.querySelector("div#contents");

// start observing the target node for configured mutations
observer.observe(videosGrid, { childList: true, subtree: true });
console.log("Hiding watched YouTube videos from Recommended...");

const getWatchedPercentage = (videoElement) => {
    return parseInt(videoElement.querySelector("div#progress").getAttribute("style").split("width: ").pop());
}

const getVideoTitle = (videoElement) => {
    return videoElement.querySelector("#video-title").innerHTML;
}

const getVideoAuthor = (videoElement) => {
    return videoElement.querySelector("a.yt-formatted-string").innerHTML;
}

const getVideoURL = (videoElement) => {
    return videoElement.querySelector("a#video-title-link").href;
}

const getVideoInformation = (videoElement) => {
    return {
        watchedPercentage: getWatchedPercentage(videoElement),
        videoMetadata: `"${getVideoTitle(videoElement)}" by ${getVideoAuthor(videoElement)}`,
        videoURL: getVideoURL(videoElement),
    }
}
