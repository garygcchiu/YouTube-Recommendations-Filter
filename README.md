# YouTube Recommendations Filter

Source code for the Chrome extension: https://chrome.google.com/webstore/detail/hide-watched-videos-from/pefndkngkakmmfnadcmnfnhemieaapbb?hl=en&authuser=0

This extension is depreciated, and the same functionality can be achieved by adding the following filters to uBlock Origin:

```
www.youtube.com##ytd-rich-item-renderer:has(yt-formatted-string:has-text(/^Mix - /))
www.youtube.com##.ytd-compact-radio-renderer:has-text(Mix - )
www.youtube.com##ytd-rich-item-renderer span.ytd-video-meta-block:has-text(/([5-9]|\d{2,}) years ago/):upward(ytd-rich-item-renderer)
www.youtube.com##ytd-rich-item-renderer:has(yt-formatted-string:has-text(/^My Mix/))
www.youtube.com##ytd-thumbnail-overlay-resume-playback-renderer:upward(ytd-rich-item-renderer)
```


Features
- Hide watched videos
- Hide old videos
- Hide YouTube Mix playlists
- UI to configure the above watched threshold, age threshold, and toggle filtering mix playlists
