// ---------- Settings ----------
const REQUIRED_FRACTION = 0.95; // watch 95% of the video to unlock
const MAX_STEP = 3;             // a jump bigger than this many seconds counts as a skip

// ---------- State ----------
let video = null;
let watched = new Set();        // which whole seconds you have genuinely watched
let lastTime = null;

// ---------- Helpers ----------
function isAdPlaying() {
  const player = document.querySelector("#movie_player");
  return player && player.classList.contains("ad-showing");
}

function percentWatched() {
  if (!video || !isFinite(video.duration) || video.duration === 0) return 0;
  return Math.min(100, Math.floor((watched.size / video.duration) * 100));
}

function lock() {
  document.body.classList.add("wbc-locked");
}

function unlock() {
  document.body.classList.remove("wbc-locked");
}

// Put the message right where the comments would be
function ensureBanner() {
  const comments = document.querySelector("ytd-comments#comments");
  if (!comments) return;

  let banner = document.getElementById("wbc-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "wbc-banner";
  }
  if (banner.nextSibling !== comments) {
    comments.parentNode.insertBefore(banner, comments);
  }
  banner.innerHTML =
    "hey hey go back to watching the video first" +
    "<small>" + percentWatched() + "% watched (need " +
    Math.round(REQUIRED_FRACTION * 100) + "%)</small>";
}

// ---------- Video listeners ----------
function onTimeUpdate() {
  if (isAdPlaying() || video.paused || video.seeking) {
    lastTime = null;
    return;
  }

  const t = video.currentTime;

  // Only count time that moved forward a little (normal playback)
  if (lastTime !== null && t >= lastTime && t - lastTime < MAX_STEP) {
    for (let s = Math.floor(lastTime); s <= Math.floor(t); s++) watched.add(s);
  }
  lastTime = t;

  if (!isFinite(video.duration)) {   // livestream: nothing to finish
    unlock();
    return;
  }

  if (watched.size >= video.duration * REQUIRED_FRACTION) {
    unlock();
  } else {
    ensureBanner();
  }
}

function onSeeking() {
  lastTime = null; // forget position so a skip is never counted
}

function detach() {
  if (!video) return;
  video.removeEventListener("timeupdate", onTimeUpdate);
  video.removeEventListener("seeking", onSeeking);
}

// ---------- Setup for each video ----------
function setup() {
  detach();
  watched = new Set();
  lastTime = null;

  if (!location.pathname.startsWith("/watch")) {
    unlock();
    return;
  }

  lock();
  video = document.querySelector("video");
  if (video) {
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("seeking", onSeeking);
  }
  ensureBanner();
}

// YouTube swaps videos without reloading the page
document.addEventListener("yt-navigate-finish", setup);

// The comments load late, so keep the banner in place while locked
setInterval(() => {
  if (document.body.classList.contains("wbc-locked")) ensureBanner();
}, 1000);

setup();
