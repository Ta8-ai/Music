const player = document.querySelector('.player');
const playerImgSong = player.querySelector('.player__img-song');
const playerTitle = player.querySelector('.player__title');
const playerArtist = player.querySelector('.player__artist');
const playerBtnPrev = player.querySelector('.player__btn--prev');
const playerBtnPlay = player.querySelector('.player__btn--play');
const playerBtnNext = player.querySelector('.player__btn--next');
const progressBarFill = player.querySelector('.progress__bar-fill');
const progressTimeCurrent = player.querySelector('.progress__time-current');
const progressTimeDuration = player.querySelector('.progress__time-duration');
const playerBtnVolume = player.querySelector('.player__btn--volume');
const volumeBarFill = player.querySelector('.volume__bar-fill');
const audio = player.querySelector('.player__audio');

let songs = [];
let currentSongIndex = 0;
let isPlaying = false;

// Fetch songs from JSON file
fetch('songs.json')
    .then(response => response.json())
    .then(data => {
        songs = data;
        loadSong(currentSongIndex);
    });

function loadSong(index) {
    const song = songs[index];
    playerImgSong.src = song.image;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    audio.src = song.mp3;
}

function playSong() {
    isPlaying = true;
    playerBtnPlay.innerHTML = '<i class="fas fa-pause"></i>';
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playerBtnPlay.innerHTML = '<i class="fas fa-play"></i>';
    audio.pause();
}

function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    playSong();
}

function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBarFill.style.width = `${progressPercent}%`;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    progressTimeCurrent.textContent = formatTime(currentTime);
    progressTimeDuration.textContent = formatTime(duration);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volume = clickX / width;
    audio.volume = volume;
    volumeBarFill.style.width = `${volume * 100}%`;
}

playerBtnPlay.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

playerBtnPrev.addEventListener('click', prevSong);
playerBtnNext.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
player.querySelector('.progress__bar').addEventListener('click', setProgress);
player.querySelector('.volume__bar').addEventListener('click', setVolume);

audio.addEventListener('ended', nextSong);
