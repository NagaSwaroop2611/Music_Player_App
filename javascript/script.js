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
    duration: "3:15",
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
    duration: "2:58",
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
    duration: "3:42",
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
    duration: "2:35",
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

// get access to all dom elements
const songList = document.getElementById("song-list");
const thumbnailContainer = document.getElementById("thumbnail-container");
const thumbnail = document.getElementById("thumbnail");
const playPauseBtn = document.getElementById("play-pause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const currTime = document.getElementById("current-time");
const leftTime = document.getElementById("time-left");
const volumeControl = document.getElementById("volume");
const trackTitle = document.getElementById("player-title");
const trackDescription = document.getElementById("player-description");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const customDropdown = document.getElementById("custom-dropdown");
const dropdownItems = document.querySelectorAll(".custom-dropdown-item");
const shuffleImg = document.getElementById("shuffle-img");
const loopImg = document.getElementById("loop-img");


// To store index of track being played
let currentSongIndex = 0;

let isShuffleMode = true;
let isRepeatMode = false;

let audio = new Audio();//Constructor invoked and object creation
console.log(audio);
console.dir(audio);//to get the object of audio
loadSong(currentSongIndex);//Hoisting


function updateCurrentSongHighlight(index){
  // Remove the current-song className
  const titleElements = document.querySelectorAll(".track-title");
  titleElements.forEach((element)=>{
    console.log(element);
    element.classList.remove("current-song");
  });

  // Add current song className on the current-song
  const currentSongTitleElement = document.querySelector(`.item-container[data-index="${index}"] .track-title`);

  if(currentSongTitleElement){
    currentSongTitleElement.classList.add("current-song");
  }

}


// To play pause the track
function playPause(){
  if(audio.paused){
    audio.play();
    playPauseBtn.innerHTML = `<img src = "./assets/icons/play-button.svg"/>`;
  }
  else{
    audio.pause();
    playPauseBtn.innerHTML = `<img src = "./assets/icons/pause-button.svg"/>`;
  }
}

// To load the song
function loadSong(index){
  const currentSong = songs[index];
  audio.src = currentSong.src;
  thumbnail.src = currentSong.thumbnail;
  trackTitle.textContent = currentSong.title;
  currTime.textContent = "00:00";
  // console.log(audio.duration);
  audio.addEventListener("loadedmetadata", () => {
    // console.log(audio.duration);
    progress.max = audio.duration;
  });
  
  updateCurrentSongHighlight(index)
}


function padZero(number){
  return(number < 10 ? "0":"") + number;
}

function formatTime(time){
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${padZero(minutes)}:${padZero(seconds)}`;
}

// Called periodically to update the progress on track 
function updateProgress(){
  const currentTime = audio.currentTime;
  const duration = audio.duration;
  const remainingTime = duration - currentTime;

  progress.value = audio.currentTime;
  currTime.textContent = `${formatTime(currentTime)}`;
  leftTime.textContent = `${remainingTime >= 0 ? "-"+formatTime(remainingTime):"00:00"}`; 
}

function updateVolume(){
  audio.volume = volumeControl.value;
}

function prevSong(){
  currentSongIndex = currentSongIndex - 1;
  if(currentSongIndex >= 0){
    loadSong(currentSongIndex);
    playPause();
    // console.log(currentSongIndex);
  }
  else{
    currentSongIndex = songs.length-1;
    loadSong(currentSongIndex);
    playPause();
  }
}

function getRandomIndexSong(){
  const randomIndex = Math.floor(Math.random() * songs.length);
  return randomIndex;
}

function nextSong(isBtnClicked) {
  //If shuffle mode is on
  if(isShuffleMode) {
    //Random select a song
    const randomIndex = getRandomIndexSong();
    currentSongIndex = randomIndex;
    loadSong(currentSongIndex);
    playPause();
  } 
  else if(isBtnClicked) {
    currentSongIndex = currentSongIndex + 1;
    if (currentSongIndex >= 0 && currentSongIndex <= songs.length - 1) {
    loadSong(currentSongIndex);
    playPause();
    } 
    else {
    currentSongIndex = 0;
    loadSong(currentSongIndex);
    playPause();
    }
  }
  else{
  audio.currentTime = 0;
  progress.value = 0;
  playPause();
  }
}

function toggleShuffleMode(){
  console.log("Hello World");
  isShuffleMode = true;
  isRepeatMode = false;
  shuffleImg.src = "./assets/icons/shuffle-highlighted.svg";
  loopImg.src = "./assets/icons/loop.svg";
}

function toggleRepeatMode(){
  isShuffleMode = false;
  isRepeatMode = true;
  shuffleImg.src = "./assets/icons/shuffle.svg";
  loopImg.src = "./assets/icons/loop-highlighted.svg";
}

function toggleDropDown(){
  if(document.getElementById("dropdown-list-items").style.display === "block"){
    document.getElementById("dropdown-list-items").style.display = "none";
    document.getElementById("dropdown-arrow").classList.remove("rotate-270");
  }
  else{
    document.getElementById("dropdown-list-items").style.display = "block";
    document.getElementById("dropdown-arrow").classList.add("rotate-270");
  }
}

dropdownItems.forEach(function (item) {
  item.addEventListener("click", function () {
    const selectedVal = this.getAttribute("data-value");
    audio.playbackRate = parseFloat(selectedVal);
    // Highlight the selected item
    dropdownItems.forEach(function (item) {
      item.classList.remove("selected-speed");
    });
    this.classList.add("selected-speed");
  });
});

// Modal JavaScript
const previewModal = document.getElementById("preview-modal");
const closeModal = document.getElementById("close-modal");
const previewImg = document.getElementById("preview-image");
const previewDescription = document.getElementById("preview-description");
const previewArtist = document.getElementById("preview-artist");
const followCount = document.getElementById("follower-count");
const listnerCount = document.getElementById("listener-count");

console.log(listnerCount);


// Function to open modal
function openModalWindow(){
  const currentTrack = songs[currentSongIndex];
  previewModal.style.display = "block";
  previewImg.src = currentTrack.thumbnail;
  previewArtist.innerText = currentTrack.artist;
  followCount.innerText = currentTrack.followers;
  listnerCount.innerText = currentTrack.monthlyListener;
  previewDescription.innerText = currentTrack.description;
  if(currentTrack.isVerfied){
    document.getElementById("verified").style.display = "flex";
  }
  else{
   document.getElementById("verified").style.display = "none"; 
  }
}

function closeModalWindow(){
  previewModal.style.display = "none";
}

// Event listener to close the preview modal when close button is clicked 
closeModal.addEventListener("click",closeModalWindow);

//Event listener to close the preview modal when close button is clicked  
window.addEventListener("click",function(event){
  if(event.target === previewModal){
    closeModalWindow();
  }
})

// Rendering the song list
function renderSongList(){
  // Clear our existing list
  songList.innerHTML='';
  // Render Songs dynamically
  songs.forEach((song,index) => {
    console.log(song);
    // Create Elements for each song
    const itemContainer = document.createElement("div");
    const itemImg = document.createElement("div");
    const imgElement = document.createElement("img");
    const thumbnailImg = document.createElement("img");
    const trackDataContainer = document.createElement("div");
    const trackTitle = document.createElement("p");
    const trackArtist = document.createElement("p");
    const trackDurationContainer = document.createElement("div");
    const trackDuration = document.createElement("p");
    const trackYear = document.createElement("p");

    // Add Classes 
    itemContainer.classList.add("item-container");
    itemContainer.setAttribute("data-index",index);
    thumbnailImg.classList.add("list-thumbnail");
    itemImg.classList.add("item-img");
    trackDataContainer.classList.add("track-data-container");
    trackTitle.classList.add("track-title");
    trackArtist.classList.add("track-artist");
    trackDurationContainer.classList.add("track-duration-container");
    trackDuration.classList.add("track-duration");
    trackYear.classList.add("track-year");

    // set attributes and content
    // Here the eventListeners is attached to every song 
    // So whenever you click on container the eventListeners will be running not the function renderSongList()
    itemContainer.addEventListener("click", () => {
      currentSongIndex = index;
      loadSong(currentSongIndex);
      playPause();
      
    });

    // Add content and structure the html
    imgElement.src = "./assets/icons/outline.svg";
    thumbnailImg.src = song.thumbnail;
    trackTitle.textContent = song.title;
    trackArtist.textContent = song.artist || "Unknown Artist";
    trackDuration.textContent = song.duration;
    trackYear.textContent = song.year || "Unknown Year";

    // Append elements to container
    itemImg.appendChild(imgElement);
    itemImg.appendChild(thumbnailImg);
    trackDataContainer.appendChild(trackTitle);
    trackDataContainer.appendChild(trackArtist);
    trackDurationContainer.appendChild(trackDuration);
    trackDurationContainer.appendChild(trackYear);

    itemContainer.appendChild(itemImg);
    itemContainer.appendChild(trackDataContainer);
    itemContainer.appendChild(trackDurationContainer);

    songList.appendChild(itemContainer);
  });
  updateCurrentSongHighlight(currentSongIndex);
}

renderSongList();

// Attach eventListener to DOM elements
playPauseBtn.addEventListener("click",playPause);

progress.addEventListener("input", function(){
  audio.currentTime = progress.value;
});

volumeControl.addEventListener("input",updateVolume);
audio.addEventListener("timeupdate",updateProgress);
prevBtn.addEventListener("click",prevSong);

nextBtn.addEventListener("click", () => nextSong(true));
audio.addEventListener("ended",() => nextSong(false));
shuffleBtn.addEventListener("click",toggleShuffleMode);
repeatBtn.addEventListener("click",toggleRepeatMode);

customDropdown.addEventListener("click",toggleDropDown);
thumbnailContainer.addEventListener("click",openModalWindow);

window.addEventListener("click",(event) => {
  if(!event.target.matches(".custom-dropdown-selected")){
    const itemsContainer = customDropdown.querySelector(".custom-dropdown-items");
    itemsContainer.style.display = "none";
    document.getElementById("dropdown-arrow").classList.remove("rotate-270");
  }
});