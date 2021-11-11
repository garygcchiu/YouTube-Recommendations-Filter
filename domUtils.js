const WATCHED_VIDEO_BAR_NODE_NAME = "YTD-THUMBNAIL-OVERLAY-RESUME-PLAYBACK-RENDERER";
const VIDEO_THUMBNAIL_NODE_NAME = "YTD-THUMBNAIL-OVERLAY-NOW-PLAYING-RENDERER";
const VIDEO_ELEMENT_NODE_NAME = "YTD-RICH-ITEM-RENDERER";
const YOUTUBE_HOME_VIDEO_ELEMENT_NODE_NAME = "YTD-RICH-ITEM-RENDERER";
const YOUTUBE_RELATED_VIDEO_ELEMENT_NODE_NAME = "YTD-COMPACT-VIDEO-RENDERER";
const YOUTUBE_RELATED_VIDEO_MED_ELEMENT_NODE_NAME = "YTD-COMPACT-RADIO-RENDERER";
const YOUTUBE_MIX_PLAYLIST_ELEMENT_NODE_NAME = "YTD-THUMBNAIL-OVERLAY-BOTTOM-PANEL-RENDERER";

const isWatchedVideo = (target) => (target.nodeName === WATCHED_VIDEO_BAR_NODE_NAME);
const isOldVideo = (target) => (target.nodeName === VIDEO_ELEMENT_NODE_NAME || target.nodeName === VIDEO_THUMBNAIL_NODE_NAME);
const isMixPlaylist = (target) => (target.nodeName === YOUTUBE_MIX_PLAYLIST_ELEMENT_NODE_NAME);

const getContentRoot = () => document.querySelector("ytd-app > div#content");

const getVideoElement = (element) => (element.closest(YOUTUBE_HOME_VIDEO_ELEMENT_NODE_NAME) ||
    element.closest(YOUTUBE_RELATED_VIDEO_ELEMENT_NODE_NAME) ||
    element.closest(YOUTUBE_RELATED_VIDEO_MED_ELEMENT_NODE_NAME));

const getWatchedPercentage = (videoElement) => {
    const progressBar = videoElement.querySelector("div#progress");
    if (progressBar) {
        return parseInt(progressBar.getAttribute("style").split("width: ").pop());
    }
};

const getVideoTitle = (videoElement) => {
    return videoElement.querySelector("#video-title")?.innerHTML.trim();
};

const getVideoAuthor = (videoElement) => {
    return (videoElement.querySelector("a.yt-formatted-string") ||
        videoElement.querySelector("yt-formatted-string")).innerHTML;
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
        watchedPercentage: !isMix ? getWatchedPercentage(videoElement) : undefined,
        videoMetadata: `"${getVideoTitle(videoElement)}"${!isMix ? ` by ${getVideoAuthor(videoElement)}` : "" }`,
        videoURL: getVideoURL(videoElement),
        age: getVideoAge(videoElement),
    }
};
