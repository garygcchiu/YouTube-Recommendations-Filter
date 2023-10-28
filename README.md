# YouTube Recommendations Filter

Source code for the Chrome extension: https://chrome.google.com/webstore/detail/hide-watched-videos-from/pefndkngkakmmfnadcmnfnhemieaapbb?hl=en&authuser=0

**This extension is deprecated, and the same functionality can be achieved by adding the following filters to uBlock Origin:**

```
www.youtube.com##ytd-rich-item-renderer:has(yt-formatted-string:has-text(/^Mix - /))
www.youtube.com##.ytd-compact-radio-renderer:has-text(Mix - )
www.youtube.com##ytd-rich-item-renderer span.ytd-video-meta-block:has-text(/([5-9]|\d{2,}) years ago/):upward(ytd-rich-item-renderer)
www.youtube.com##ytd-rich-item-renderer:has(yt-formatted-string:has-text(/^My Mix/))
www.youtube.com##ytd-thumbnail-overlay-resume-playback-renderer:upward(ytd-rich-item-renderer)
```

Add this to filter out videos with <1000 views:
```
www.youtube.com##ytd-rich-item-renderer span.ytd-video-meta-block:has-text(/\d{1,3} views/):upward(ytd-rich-item-renderer)
```

If you want to not exclude watched videos from a channel's page, use this rule instead of the ^ last rule (may not work on all AdBlock engines. Works on uBlock Origin though):
```
www.youtube.com##ytd-thumbnail-overlay-resume-playback-renderer:upward(ytd-rich-item-renderer:not([is-slim-grid=""]))
```



Features
- Hide watched videos
- Hide old videos
- Hide YouTube Mix playlists
- UI to configure the above watched threshold, age threshold, and toggle filtering mix playlists
