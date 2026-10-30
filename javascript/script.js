const songs = [
  {
    title: "Drive breakbeat",
    duration: "1:49",
    thumbnail: "./data/preview-img-1.jpg",
    src: "./data/track1.mp3",
    artist: "Rockot",
    year: 2023,
    isVerified: true,
    followers: 1371245,
    monthlyListener: 12346313,
    description:
      "An energetic breakbeat track featuring powerful electronic drums, catchy rhythms, and dynamic basslines. Perfect for driving, workouts, and high-energy moments.",
  },
  {
    title: "Titanium",
    duration: "1:46",
    thumbnail: "./data/preview-img-2.jpg",
    src: "./data/track2.mp3",
    artist: "AlisiaBeats",
    year: 2023,
    isVerified: true,
    followers: 50,
    monthlyListener: 20,
    description:
      "A powerful electronic music experience combining uplifting melodies with deep bass and energetic beats. A perfect choice for motivation and relaxation.",
  },
  {
    title: "Science Documentary",
    duration: "2:07",
    thumbnail: "./data/preview-img-3.jpg",
    src: "./data/track3.mp3",
    artist: "Lexin_Music",
    year: 2023,
    isVerified: false,
    followers: 80,
    monthlyListener: 10,
    description:
      "An atmospheric instrumental composition designed for documentaries, scientific presentations, and educational videos. Creates a sense of curiosity and discovery.",
  },
  {
    title: "Once In Paris",
    duration: "2:12",
    thumbnail: "./data/preview-img-4.jpg",
    src: "./data/track4.mp3",
    artist: "Pumpupthemind",
    year: 2023,
    isVerified: false,
    followers: 12,
    monthlyListener: 45,
    description:
      "A relaxing and romantic instrumental inspired by the beautiful streets of Paris. Soft melodies and gentle rhythms create a peaceful atmosphere.",
  },
  {
    title: "Midnight Dreams",
    duration: "3:38",
    thumbnail: "./data/preview-img-5.jpg",
    src: "./data/track5.mp3",
    artist: "DreamWave",
    year: 2024,
    isVerified: true,
    followers: 24500,
    monthlyListener: 185000,
    description:
      "A dreamy electronic composition featuring ambient synths, smooth transitions, and soothing melodies. Perfect for late-night listening and unwinding.",
  },
  {
    title: "Summer Vibes",
    duration: "4:08",
    thumbnail: "./data/preview-img-6.jpg",
    src: "./data/track6.mp3",
    artist: "SunnyBeats",
    year: 2024,
    isVerified: true,
    followers: 18700,
    monthlyListener: 92000,
    description:
      "A cheerful and upbeat tropical-inspired track with vibrant melodies, refreshing rhythms, and energetic percussion. Bring the summer feeling wherever you go.",
  },
  {
    title: "Lost In Space",
    duration: "4:07",
    thumbnail: "./data/preview-img-7.jpg",
    src: "./data/track7.mp3",
    artist: "CosmicSound",
    year: 2024,
    isVerified: false,
    followers: 5600,
    monthlyListener: 32000,
    description:
      "An immersive space-themed instrumental filled with atmospheric soundscapes, futuristic synths, and mysterious melodies. Ideal for creative projects and cinematic backgrounds.",
  },
  {
    title: "Feel The Beat",
    duration: "3:20",
    thumbnail: "./data/preview-img-8.jpg",
    src: "./data/track8.mp3",
    artist: "BeatMaster",
    year: 2025,
    isVerified: true,
    followers: 78000,
    monthlyListener: 450000,
    description:
      "A high-energy dance track packed with infectious beats, punchy bass, and exciting electronic melodies. Made for parties, dancing, and keeping the energy alive.",
  },
];

// ---------- DOM ----------
const $ = (id) => document.getElementById(id);
const songList = $("song-list"), thumbnailContainer = $("thumbnail-container"), thumbnail = $("thumbnail");
const playPauseBtn = $("play-pause"), prevBtn = $("prev"), nextBtn = $("next");
const progress = $("progress"), currTime = $("current-time"), leftTime = $("time-left");
const volumeControl = $("volume"), trackTitle = $("player-title"), trackDescription = $("player-description");
const shuffleBtn = $("shuffle"), repeatBtn = $("repeat"), shuffleImg = $("shuffle-img"), loopImg = $("loop-img");
const customDropdown = $("custom-dropdown"), dropdownItems = document.querySelectorAll(".custom-dropdown-item");

// ---------- State ----------
let currentSongIndex = 0;
let isShuffleMode = false;
let repeatMode = "off"; // "off" | "all" | "one"
let shuffleHistory = []; // so Prev works in shuffle mode
const audio = new Audio();
audio.volume = volumeControl.value;

// ---------- Helpers ----------
const lastIndex = () => songs.length - 1;
const padZero = (n) => (n < 10 ? "0" : "") + n;
const formatTime = (t) => (isFinite(t) ? `${padZero(Math.floor(t / 60))}:${padZero(Math.floor(t % 60))}` : "00:00");
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function getRandomIndexSong() {
  if (songs.length < 2) return 0;
  let i;
  do { i = Math.floor(Math.random() * songs.length); } while (i === currentSongIndex);
  return i;
}

// ---------- Rules for Prev / Next ----------
// Repeat-one locks playback to the current song, so Prev/Next are disabled in that mode.
function canGoNext() { return repeatMode !== "one" && (isShuffleMode || repeatMode === "all" || currentSongIndex < lastIndex()); }
function canGoPrev() { return repeatMode !== "one" && ((isShuffleMode && shuffleHistory.length > 0) || repeatMode === "all" || (!isShuffleMode && currentSongIndex > 0)); }

function updateControlsUI() {
  nextBtn.disabled = !canGoNext();
  prevBtn.disabled = !canGoPrev();
  shuffleImg.src = `./assets/icons/${isShuffleMode ? "shuffle-highlighted" : "shuffle"}.svg`;
  loopImg.src = `./assets/icons/${repeatMode === "off" ? "loop" : "loop-highlighted"}.svg`;
  repeatBtn.dataset.mode = repeatMode; // CSS shows a small "1" badge for repeat-one
  repeatBtn.title = { off: "Repeat: off", all: "Repeat: playlist", one: "Repeat: this song" }[repeatMode];
  shuffleBtn.title = isShuffleMode ? "Shuffle: on" : "Shuffle: off";
}

function updatePlayIcon() {
  // keeping your original icon mapping
  playPauseBtn.innerHTML = `<img src="./assets/icons/${audio.paused ? "pause-button" : "play-button"}.svg" alt="${audio.paused ? "Paused" : "Playing"}"/>`;
}

function updateCurrentSongHighlight(index) {
  document.querySelectorAll(".item-container").forEach((el) =>
    el.classList.toggle("active", Number(el.dataset.index) === index));
  document.querySelectorAll(".track-title").forEach((el) => el.classList.remove("current-song"));
  const t = document.querySelector(`.item-container[data-index="${index}"] .track-title`);
  if (t) t.classList.add("current-song");
}

// ---------- Playback ----------
function loadSong(index, autoplay = false) {
  currentSongIndex = index;
  const s = songs[index];
  audio.src = s.src;
  thumbnail.src = s.thumbnail;
  trackTitle.textContent = s.title;
  trackDescription.textContent = s.artist;
  currTime.textContent = "00:00";
  leftTime.textContent = "-" + s.duration.padStart(5, "0");
  progress.value = 0;
  updateCurrentSongHighlight(index);
  updateControlsUI();
  if (autoplay) audio.play().catch(() => {});
}

audio.addEventListener("loadedmetadata", () => { progress.max = audio.duration; });
audio.addEventListener("play", updatePlayIcon);
audio.addEventListener("pause", updatePlayIcon);

function playPause() {
  if (audio.paused) audio.play().catch(() => {});
  else audio.pause();
}

function nextSong() {
  if (!canGoNext()) return;
  let next;
  if (isShuffleMode) { shuffleHistory.push(currentSongIndex); next = getRandomIndexSong(); }
  else next = currentSongIndex < lastIndex() ? currentSongIndex + 1 : 0; // wrap only when repeat = all
  loadSong(next, true);
}

function prevSong() {
  if (!canGoPrev()) return;
  let prev;
  if (isShuffleMode) prev = shuffleHistory.pop();
  else prev = currentSongIndex > 0 ? currentSongIndex - 1 : lastIndex();
  loadSong(prev, true);
}

// Song finished by itself
audio.addEventListener("ended", () => {
  if (repeatMode === "one" && !isShuffleMode) { audio.currentTime = 0; audio.play(); }
  else if (canGoNext()) nextSong();
  else { audio.currentTime = 0; updatePlayIcon(); } // end of playlist, no repeat: stop
});

// ---------- Modes ----------
function toggleShuffleMode() {
  isShuffleMode = !isShuffleMode;
  if (isShuffleMode) repeatMode = "off"; // shuffle and repeat are exclusive
  shuffleHistory = [];
  updateControlsUI();
}

function toggleRepeatMode() {
  repeatMode = { off: "all", all: "one", one: "off" }[repeatMode]; // off -> playlist -> one song -> off
  if (repeatMode !== "off") isShuffleMode = false;
  updateControlsUI();
}

// ---------- Progress / volume ----------
function updateProgress() {
  const remaining = audio.duration - audio.currentTime;
  progress.value = audio.currentTime;
  currTime.textContent = formatTime(audio.currentTime);
  leftTime.textContent = remaining >= 0 ? "-" + formatTime(remaining) : "00:00";
}

// ---------- Speed dropdown ----------
function toggleDropDown() {
  const list = $("dropdown-list-items");
  const open = list.style.display === "block";
  list.style.display = open ? "none" : "block";
  $("dropdown-arrow").classList.toggle("rotate-270", !open);
}

dropdownItems.forEach((item) => {
  item.addEventListener("click", function () {
    const rate = parseFloat(this.dataset.value);
    audio.playbackRate = audio.defaultPlaybackRate = rate;
    dropdownItems.forEach((i) => i.classList.remove("selected-speed"));
    this.classList.add("selected-speed");
  });
});

// ---------- Modal ----------
const previewModal = $("preview-modal"), closeModal = $("close-modal");

function openModalWindow() {
  const t = songs[currentSongIndex];
  previewModal.style.display = "flex";
  $("preview-image").src = t.thumbnail;
  $("preview-artist").innerText = t.artist;
  $("follower-count").innerText = compact.format(t.followers);
  $("listener-count").innerText = compact.format(t.monthlyListener);
  $("preview-description").innerText = t.description;
  $("verified").style.display = t.isVerified ? "flex" : "none"; // was "isVerfied" (typo)
}
function closeModalWindow() { previewModal.style.display = "none"; }
closeModal.addEventListener("click", closeModalWindow);
window.addEventListener("click", (e) => { if (e.target === previewModal) closeModalWindow(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModalWindow(); });

// ---------- Song list ----------
function renderSongList() {
  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const row = document.createElement("div");
    row.className = "item-container";
    row.dataset.index = index;
    row.innerHTML = `
      <div class="item-img"><img src="./assets/icons/outline.svg" alt=""/><img class="list-thumbnail" src="${song.thumbnail}" alt=""/></div>
      <div class="track-data-container"><p class="track-title"></p><p class="track-artist"></p></div>
      <div class="track-duration-container"><p class="track-duration"></p><p class="track-year"></p></div>`;
    row.querySelector(".track-title").textContent = song.title;
    row.querySelector(".track-artist").textContent = song.artist || "Unknown Artist";
    row.querySelector(".track-duration").textContent = song.duration;
    row.querySelector(".track-year").textContent = song.year || "Unknown Year";
    row.addEventListener("click", () => {
      if (isShuffleMode) shuffleHistory.push(currentSongIndex);
      loadSong(index, true);
    });
    songList.appendChild(row);
  });
  updateCurrentSongHighlight(currentSongIndex);
}

// ---------- Wire up ----------
playPauseBtn.addEventListener("click", playPause);
progress.addEventListener("input", () => { audio.currentTime = progress.value; });
volumeControl.addEventListener("input", () => { audio.volume = volumeControl.value; });
audio.addEventListener("timeupdate", updateProgress);
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
shuffleBtn.addEventListener("click", toggleShuffleMode);
repeatBtn.addEventListener("click", toggleRepeatMode);
customDropdown.addEventListener("click", toggleDropDown);
thumbnailContainer.addEventListener("click", openModalWindow);
window.addEventListener("click", (e) => {
  if (!e.target.closest(".custom-dropdown-selected")) {
    $("dropdown-list-items").style.display = "none";
    $("dropdown-arrow").classList.remove("rotate-270");
  }
});

renderSongList();
loadSong(currentSongIndex);
updatePlayIcon();

// ---------- Volume popover (small screens) ----------
const volumeContainer = $("volume-container"), volumeToggle = $("volume-toggle");
volumeToggle.addEventListener("click", (e) => { e.stopPropagation(); volumeContainer.classList.toggle("open"); });
document.addEventListener("click", (e) => { if (!volumeContainer.contains(e.target)) volumeContainer.classList.remove("open"); });
volumeControl.addEventListener("input", () => {
  $("volume-toggle-img").src = `./assets/icons/volume-${Number(volumeControl.value) === 0 ? "low" : "high"}.svg`;
});