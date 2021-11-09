let watchedThresholdInput;
let ageThresholdInput;
let filterMixPlaylistsInput;
let settingsForm;
let settingsSavedMessageDiv;

const DEFAULT_WATCHED_THRESHOLD = 0;
const DEFAULT_AGE_THRESHOLD = 5;
const DEFAULT_FILTER_MIX_PLAYLISTS = true;

document.addEventListener('DOMContentLoaded', function() {
    watchedThresholdInput = document.getElementById("watched-threshold");
    ageThresholdInput = document.getElementById("age-threshold");
    filterMixPlaylistsInput = document.getElementById("filter-mix-playlist");
    settingsForm = document.getElementById("settings");
    settingsSavedMessageDiv = document.getElementById("settings-saved-message");

    // add event listener to handle saving settings
    settingsForm.addEventListener('submit', onSettingsSave);
});

chrome.storage.sync.get("watchedThreshold", ({ watchedThreshold }) => {
    // use default if none loaded
    if (!watchedThreshold && watchedThresholdInput) {
        watchedThresholdInput.value = DEFAULT_WATCHED_THRESHOLD
        return;
    }
    // use provided value
    if (watchedThresholdInput) {
        watchedThresholdInput.value = watchedThreshold;
    }
});

chrome.storage.sync.get("ageThreshold", ({ ageThreshold }) => {
    // use default if none loaded
    if (!ageThreshold && ageThresholdInput) {
        ageThresholdInput.value = DEFAULT_AGE_THRESHOLD
        return;
    }
    if (ageThresholdInput) {
        ageThresholdInput.value = ageThreshold;
    }
});

chrome.storage.sync.get("filterMixPlaylists", ({ filterMixPlaylists }) => {
    // use default if none loaded
    if (filterMixPlaylists === undefined && filterMixPlaylistsInput) {
        filterMixPlaylistsInput.checked = DEFAULT_FILTER_MIX_PLAYLISTS
        return;
    }
    if (filterMixPlaylistsInput) {
        filterMixPlaylistsInput.checked = filterMixPlaylists;
    }
});

function onSettingsSave (e) {
    e.preventDefault();
    const newWatchedThreshold = watchedThresholdInput.value;
    const newAgeThreshold = ageThresholdInput.value;
    const newFilterMixPlaylists = filterMixPlaylistsInput.checked;

    console.log(`Saving ${newWatchedThreshold} watched threshold, ${newAgeThreshold} age threshold, ${newFilterMixPlaylists} filter mix playlists...`);
    chrome.storage.sync.set({
        watchedThreshold: newWatchedThreshold,
        ageThreshold: newAgeThreshold,
        filterMixPlaylists: newFilterMixPlaylists
    });
    settingsSavedMessageDiv.style.setProperty("display", "block");
}

