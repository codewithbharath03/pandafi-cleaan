console.log("Pandafi Clone Ready");

let currentSong = new Audio();
let songs = [];
let currFolder = "";

let shuffleMode = false;
let repeatMode = 0;
let appStarted = false;
let isDraggingSeekbar = false;

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("previous");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const themeSelect = document.getElementById("themeSelect");
const speedControl = document.getElementById("speedControl");
const authOverlay = document.getElementById("authOverlay");
const openLogin = document.getElementById("openLogin");
const openSignup = document.getElementById("openSignup");
const closeAuth = document.getElementById("closeAuth");
const authTitle = document.getElementById("authTitle");
const authSubmit = document.getElementById("authSubmit");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const confirmPassword = document.getElementById("confirmPassword");
const authBox = document.querySelector(".authBox");
const logoutBtn = document.getElementById("logoutBtn");
const userEmailBtn = document.getElementById("userEmail");

let authMode = "login";

function showToast(message) {
    /* This function shows a small popup message, so users know what happened after clicking or saving something. */
    let toast = document.querySelector(".toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

function secondsToMinutesSeconds(seconds) {
    /* This function changes audio seconds into clean time format like 01:25. */
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function getFullSongPath(song) {
    /* This function creates the correct song path, so liked songs and normal folder songs both work. */
    return song.includes("songs/") ? song : `${currFolder}/${song}`;
}

function getSongName(song) {
    /* This function removes the folder path and shows only the clean song file name. */
    return decodeURIComponent(song.split("/").pop()).trim();
}

function getCurrentSongIndex() {
    /* This function finds the currently playing song index, so next and previous buttons know where to move. */
    let current = getSongName(currentSong.src);

    return songs.findIndex(song => {
        return getSongName(song) === current;
    });
}

function playNextSong() {
    /* This function plays the next song and also handles shuffle, repeat playlist, and repeat one song. */
    if (songs.length === 0) return;

    if (repeatMode === 2) {
        currentSong.currentTime = 0;
        currentSong.play();
        if (playBtn) playBtn.src = "pause.svg";
        return;
    }

    if (shuffleMode) {
        let randomIndex = Math.floor(Math.random() * songs.length);
        playMusic(songs[randomIndex]);
        return;
    }

    let index = getCurrentSongIndex();

    if (index === -1) {
        playMusic(songs[0]);
        return;
    }

    let nextIndex = index + 1;

    if (nextIndex >= songs.length) {
        if (repeatMode === 1) {
            nextIndex = 0;
        } else {
            return;
        }
    }

    playMusic(songs[nextIndex]);
}

function playPreviousSong() {
    /* This function plays the previous song and moves to the last song if the first song is active. */
    if (songs.length === 0) return;

    let index = getCurrentSongIndex();

    if (index === -1) {
        playMusic(songs[0]);
        return;
    }

    let prevIndex = index - 1;

    if (prevIndex < 0) {
        prevIndex = songs.length - 1;
    }

    playMusic(songs[prevIndex]);
}

function loadSongDurations() {
    /* This function loads each song duration and prints it inside the song list. */
    document.querySelectorAll(".songDuration").forEach(durationBox => {
        let audio = new Audio(durationBox.dataset.src);

        audio.addEventListener("loadedmetadata", () => {
            durationBox.innerText = secondsToMinutesSeconds(audio.duration);
        });
    });
}

function displaySongs(songArray) {
    /* This function prints songs into the left library and attaches play and like button actions. */
    let ul = document.querySelector(".songList ul");

    if (!ul) return;

    ul.innerHTML = "";

    if (songArray.length === 0) {
        ul.innerHTML = `<li style="text-align:center;">No songs found 😢</li>`;
        return;
    }

    let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

    songArray.forEach(song => {
        let fullPath = getFullSongPath(song);
        let displayName = getSongName(song);
        let isLiked = likedSongs.includes(fullPath);

        ul.innerHTML += `
        <li data-song="${song}">
            <img class="invert" width="34" src="music.svg" alt="music">

            <div class="info">
                <div>${displayName}</div>
                <div>Bharath</div>
            </div>

            <div class="songDuration" data-src="${fullPath}">00:00</div>

            <div class="playnow">
                <button class="likeBtn" data-song="${song}" type="button">
                    ${isLiked ? "♥" : "♡"}
                </button>

                <span>Play Now</span>
                <img class="invert" src="play.svg" alt="play">
            </div>
        </li>`;
    });

    document.querySelectorAll(".songList li").forEach(li => {
        li.addEventListener("click", () => {
            playMusic(li.dataset.song);
        });
    });

    document.querySelectorAll(".likeBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();

            let song = getFullSongPath(btn.dataset.song);
            let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

            if (likedSongs.includes(song)) {
                likedSongs = likedSongs.filter(s => s !== song);
                btn.innerText = "♡";

                if (currFolder === "likedSongs") {
                    songs = songs.filter(s => getFullSongPath(s) !== song);
                    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
                    displaySongs(songs);
                    loadSongDurations();
                    return;
                }
            } else {
                likedSongs.push(song);
                btn.innerText = "♥";
            }

            localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
        });
    });
}

   async function getSongs(folder) {
    currFolder = folder;

    if (folder === "songs/cs") {
        songs = [
           //Add songs
        ];
    }

    else if (folder === "songs/ncs") {
        songs = [
          //Add songs 
        ];
    }

    else if (folder === "songs/kannada_hitts") {
        songs = [
          //Add songs  
        ];
    }

    displaySongs(songs);
    loadSongDurations();

    return songs;
}

function playMusic(track, pause = false) {
    /* This function plays the selected song and updates playbar song name, time, and saved last song. */
    if (!track) return;

    currentSong.src = track.includes("songs/") ? track : `${currFolder}/${track}`;

    if (!pause) {
        currentSong.play();
        if (playBtn) playBtn.src = "pause.svg";
        showToast("Now playing: " + getSongName(track));
    }

    const songInfo = document.querySelector(".songinfo");
    const songTime = document.querySelector(".songtime");

    if (songInfo) songInfo.innerText = getSongName(track);
    if (songTime) songTime.innerText = "00:00 / 00:00";

    localStorage.setItem("lastSong", track);
    localStorage.setItem("lastFolder", currFolder);
}

function setupLikedCardImage() {
    /* This function lets user change the liked songs card image and saves it in localStorage. */
    const likedImageInput = document.getElementById("likedImageInput");
    const likedCardImage = document.getElementById("likedCardImage");

    if (!likedImageInput || !likedCardImage) return;

    const savedLikedImage = localStorage.getItem("likedCardImage");

    if (savedLikedImage) {
        likedCardImage.src = savedLikedImage;
    }

    likedCardImage.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        likedImageInput.click();
    });

    likedImageInput.addEventListener("change", () => {
        const file = likedImageInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function(event) {
            likedCardImage.src = event.target.result;
            localStorage.setItem("likedCardImage", event.target.result);
            showToast("Liked card image updated ✅");
        };

        reader.readAsDataURL(file);
    });
}

function loadUserPlaylists() {
    /* This function loads custom user playlists from localStorage and shows them as cards. */
    let savedPlaylists = JSON.parse(localStorage.getItem("userPlaylists")) || [];
    let cardContainer = document.querySelector(".cardContainer");

    if (!cardContainer) return;

    document.querySelectorAll(".userPlaylistCard").forEach(card => card.remove());

    const likedCard = document.querySelector(".likedCard");

    savedPlaylists.forEach(name => {
        let playlistCard = document.createElement("div");
        playlistCard.className = "card userPlaylistCard";
        playlistCard.innerHTML = `
            <button class="deletePlaylistBtn" data-name="${name}" type="button">×</button>
            <img src="image/liked.png" alt="playlist">
            <h2>${name}</h2>
            <p>Your custom playlist</p>
        `;

        if (likedCard && likedCard.nextSibling) {
            cardContainer.insertBefore(playlistCard, likedCard.nextSibling);
        } else {
            cardContainer.appendChild(playlistCard);
        }
    });

    document.querySelectorAll(".deletePlaylistBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            removeUserPlaylist(btn.dataset.name);
        });
    });

    document.querySelectorAll(".userPlaylistCard").forEach(card => {
        card.addEventListener("click", () => {
            let playlistName = card.querySelector("h2").innerText;
            openUserPlaylist(playlistName);
        });
    });

    setupPlaybarPlaylistSelect();
}

function createUserPlaylist() {
    /* This function creates a new playlist name and saves it in localStorage. */
    let input = document.getElementById("playlistNameInput");

    if (!input) return;

    let name = input.value.trim();

    if (name === "") {
        showToast("Enter playlist name");
        return;
    }

    let savedPlaylists = JSON.parse(localStorage.getItem("userPlaylists")) || [];

    if (savedPlaylists.includes(name)) {
        showToast("Playlist already exists");
        return;
    }

    savedPlaylists.push(name);
    localStorage.setItem("userPlaylists", JSON.stringify(savedPlaylists));

    input.value = "";
    showToast("Playlist created ✅");
    loadUserPlaylists();
}

function removeUserPlaylist(name) {
    /* This function deletes a custom playlist and also removes its saved songs. */
    let savedPlaylists = JSON.parse(localStorage.getItem("userPlaylists")) || [];

    savedPlaylists = savedPlaylists.filter(playlist => playlist !== name);

    localStorage.setItem("userPlaylists", JSON.stringify(savedPlaylists));
    localStorage.removeItem("playlist_" + name);

    loadUserPlaylists();
    showToast("Playlist removed 🗑️");
}

function addSongToPlaylist(playlistName, song) {
    /* This function adds the currently playing song into the selected custom playlist. */
    let key = "playlist_" + playlistName;
    let playlistSongs = JSON.parse(localStorage.getItem(key)) || [];

    if (!playlistSongs.includes(song)) {
        playlistSongs.push(song);
        localStorage.setItem(key, JSON.stringify(playlistSongs));
        showToast("Song added to " + playlistName + " ✅");
    } else {
        showToast("Song already in playlist");
    }
}

function openUserPlaylist(playlistName) {
    /* This function opens a custom playlist and displays its saved songs in the library. */
    let key = "playlist_" + playlistName;
    let playlistSongs = JSON.parse(localStorage.getItem(key)) || [];

    currFolder = "customPlaylist";
    songs = playlistSongs;

    if (playlistSongs.length === 0) {
        const ul = document.querySelector(".songList ul");
        if (ul) ul.innerHTML = `<li style="text-align:center;">No songs in ${playlistName}</li>`;
        return;
    }

    displaySongs(playlistSongs);
    loadSongDurations();
    showToast("Opened " + playlistName);
}

function setupPlaybarPlaylistSelect() {
    /* This function fills the playbar Add dropdown with all custom playlists. */
    let select = document.getElementById("addCurrentToPlaylist");

    if (!select) return;

    select.innerHTML = `<option value="">Add</option>`;

    let savedPlaylists = JSON.parse(localStorage.getItem("userPlaylists")) || [];

    savedPlaylists.forEach(name => {
        select.innerHTML += `<option value="${name}">${name}</option>`;
    });

    select.onchange = () => {
        if (select.value === "") return;

        if (!currentSong.src) {
            showToast("Play a song first");
            select.value = "";
            return;
        }

        addSongToPlaylist(select.value, currentSong.src);
        select.value = "";
    };
}

function setupSearch() {
    /* This function searches songs from the current song list and shows suggestions. */
    let searchInput = document.getElementById("searchInput");
    let suggestionsBox = document.getElementById("suggestions");

    if (!searchInput || !suggestionsBox) return;

    searchInput.addEventListener("input", () => {
        let query = searchInput.value.toLowerCase().trim();
        suggestionsBox.innerHTML = "";

        if (query === "") {
            suggestionsBox.style.display = "none";
            displaySongs(songs);
            loadSongDurations();
            return;
        }

        let matchedSongs = songs.filter(song => {
            return getSongName(song).toLowerCase().includes(query);
        });

        if (matchedSongs.length === 0) {
            suggestionsBox.innerHTML = `<div class="suggestionItem">No songs found 😢</div>`;
            suggestionsBox.style.display = "block";
            return;
        }

        matchedSongs.slice(0, 6).forEach(song => {
            suggestionsBox.innerHTML += `
            <div class="suggestionItem" data-song="${song}">
                🎵 ${getSongName(song)}
            </div>`;
        });

        suggestionsBox.style.display = "block";

        document.querySelectorAll(".suggestionItem").forEach(item => {
            item.addEventListener("click", () => {
                let selectedSong = item.dataset.song;
                searchInput.value = getSongName(selectedSong);
                suggestionsBox.style.display = "none";
                playMusic(selectedSong);
            });
        });
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".searchBox")) {
            suggestionsBox.style.display = "none";
        }
    });
}

function setupCards() {
    /* This function connects playlist cards to their song folders. */
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", async () => {
            if (card.classList.contains("likedCard")) return;
            if (card.classList.contains("userPlaylistCard")) return;

            let folder = card.dataset.folder;
            if (!folder) return;

            songs = await getSongs(`songs/${folder}`);

            if (songs.length > 0) {
                playMusic(songs[0]);
            }
        });
    });
}

function setupLikedCard() {
    /* This function opens liked songs when the liked card is clicked. */
    let likedCard = document.querySelector(".likedCard");

    if (!likedCard) return;

    likedCard.addEventListener("click", (e) => {
        if (e.target.id === "likedCardImage" || e.target.id === "likedImageInput") {
            return;
        }

        let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

        currFolder = "likedSongs";
        songs = likedSongs;

        if (likedSongs.length === 0) {
            const ul = document.querySelector(".songList ul");
            if (ul) ul.innerHTML = `<li style="text-align:center;">No liked songs ❤️</li>`;
            return;
        }

        displaySongs(likedSongs);
        loadSongDurations();
    });
}

function setupPlayPause() {
    /* This function connects the play button to pause and resume audio. */
    if (!playBtn) return;

    playBtn.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playBtn.src = "pause.svg";
        } else {
            currentSong.pause();
            playBtn.src = "play.svg";
        }
    });
}

function setupTimeUpdate() {
    /* This function updates the current time, total duration, seekbar progress, and progress color. */
    currentSong.addEventListener("timeupdate", () => {
        const songTime = document.querySelector(".songtime");
        const circle = document.querySelector(".circle");
        const seekbar = document.querySelector(".seekbar");

        if (songTime) {
            songTime.innerText = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        }

        let progress = (currentSong.currentTime / currentSong.duration) * 100;
        if (isNaN(progress)) progress = 0;

        if (circle) {
            circle.style.left = Math.min(progress, 100) + "%";
        }

        if (seekbar) {
            let themeColor = getComputedStyle(document.documentElement).getPropertyValue("--theme-color");

            seekbar.style.background = `linear-gradient(
                to right,
                ${themeColor} 0%,
                ${themeColor} ${progress}%,
                rgba(255,255,255,0.08) ${progress}%,
                rgba(255,255,255,0.08) 100%
            )`;
        }
    });

    currentSong.addEventListener("ended", playNextSong);
}

function updateSeekbar(e) {
    /* This function changes the song current time when user clicks or drags the seekbar. */
    const seekbar = document.querySelector(".seekbar");
    if (!seekbar || isNaN(currentSong.duration)) return;

    let rect = seekbar.getBoundingClientRect();
    let clientX = e.clientX;

    if (e.touches) {
        clientX = e.touches[0].clientX;
    }

    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));

    currentSong.currentTime = percent * currentSong.duration;
}

function setupSeekbar() {
    /* This function connects mouse and touch dragging to the seekbar. */
    const seekbar = document.querySelector(".seekbar");
    if (!seekbar) return;

    seekbar.addEventListener("mousedown", (e) => {
        isDraggingSeekbar = true;
        updateSeekbar(e);
    });

    document.addEventListener("mousemove", (e) => {
        if (isDraggingSeekbar) {
            updateSeekbar(e);
        }
    });

    document.addEventListener("mouseup", () => {
        isDraggingSeekbar = false;
    });

    seekbar.addEventListener("touchstart", (e) => {
        isDraggingSeekbar = true;
        updateSeekbar(e);
    });

    document.addEventListener("touchmove", (e) => {
        if (isDraggingSeekbar) {
            updateSeekbar(e);
        }
    });

    document.addEventListener("touchend", () => {
        isDraggingSeekbar = false;
    });
}

function setupPlayerButtons() {
    /* This function connects previous, next, shuffle, and repeat controls. */
    if (prevBtn) prevBtn.addEventListener("click", playPreviousSong);
    if (nextBtn) nextBtn.addEventListener("click", playNextSong);

    if (shuffleBtn) {
        shuffleBtn.addEventListener("click", () => {
            shuffleMode = !shuffleMode;
            shuffleBtn.style.opacity = shuffleMode ? "1" : "0.5";
            shuffleBtn.classList.toggle("active");
            showToast(shuffleMode ? "Shuffle on 🔀" : "Shuffle off");
        });
    }

    if (repeatBtn) {
        repeatBtn.addEventListener("click", () => {
            repeatMode++;
            if (repeatMode > 2) repeatMode = 0;

            if (repeatMode === 0) {
                repeatBtn.src = "repeat.svg";
                repeatBtn.style.opacity = "0.5";
                repeatBtn.title = "Repeat Off";
                showToast("Repeat off");
            }

            if (repeatMode === 1) {
                repeatBtn.src = "repeat.svg";
                repeatBtn.style.opacity = "1";
                repeatBtn.title = "Repeat Playlist";
                showToast("Repeat playlist 🔁");
            }

            if (repeatMode === 2) {
                repeatBtn.src = "repeat-one.svg";
                repeatBtn.style.opacity = "1";
                repeatBtn.title = "Repeat One Song";
                showToast("Repeat one song 🔂");
            }
        });
    }
}

function setupVolume() {
    /* This function controls volume range and mute/unmute icon behavior. */
    let volumeInput = document.querySelector(".range input");
    let volumeIcon = document.querySelector(".volume img");

    if (volumeInput) {
        volumeInput.value = 50;
        currentSong.volume = 0.5;

        volumeInput.addEventListener("input", e => {
            currentSong.volume = e.target.value / 100;
        });
    }

    if (volumeIcon && volumeInput) {
        volumeIcon.addEventListener("click", () => {
            if (currentSong.volume > 0) {
                currentSong.volume = 0;
                volumeInput.value = 0;
                volumeIcon.src = "mute.svg";
            } else {
                currentSong.volume = 0.5;
                volumeInput.value = 50;
                volumeIcon.src = "volume.svg";
            }
        });
    }
}

function setupKeyboardShortcuts() {
    /* This function lets user control music with keyboard space, right arrow, and left arrow. */
    document.addEventListener("keydown", (e) => {
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

        if (e.code === "Space") {
            e.preventDefault();
            if (playBtn) playBtn.click();
        }

        if (e.code === "ArrowRight") {
            if (nextBtn) nextBtn.click();
        }

        if (e.code === "ArrowLeft") {
            if (prevBtn) prevBtn.click();
        }
    });
}

function setupSidebar() {
    /* This function opens and closes sidebar on tablet and mobile. */
    let hamburger = document.querySelector(".hamburger");
    let closeBtn = document.querySelector(".close");
    let left = document.querySelector(".left");

    if (hamburger && left) {
        hamburger.addEventListener("click", () => {
            left.style.left = "0";
        });
    }

    if (closeBtn && left) {
        closeBtn.addEventListener("click", () => {
            left.style.left = "-130%";
        });
    }
}

function setupTheme() {
    /* This function changes the app theme color and saves user choice. */
    if (!themeSelect) return;

    themeSelect.addEventListener("change", () => {
        const color = {
            green: "#1db954",
            pink: "#ff4fd8",
            blue: "#4f7dff"
        }[themeSelect.value];

        document.documentElement.style.setProperty("--theme-color", color);
        localStorage.setItem("theme", themeSelect.value);
    });

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        themeSelect.value = savedTheme;
        themeSelect.dispatchEvent(new Event("change"));
    }
}

function setupSpeedControl() {
    /* This function changes audio playback speed like 1x, 1.5x, or 2x. */
    if (!speedControl) return;

    speedControl.addEventListener("change", () => {
        currentSong.playbackRate = Number(speedControl.value);
        showToast("Speed: " + speedControl.value + "x");
    });
}

function setupVisualizer() {
    /* This function starts and stops the small visualizer animation when music plays or pauses. */
    currentSong.addEventListener("play", () => {
        document.querySelector(".visualizer")?.classList.add("playing");
    });

    currentSong.addEventListener("pause", () => {
        document.querySelector(".visualizer")?.classList.remove("playing");
    });
}

function hideMusicApp() {
    /* This function hides the main music app when user is not logged in. */
    const app = document.querySelector(".spotifyPlaylists");
    if (app) app.style.display = "none";
}

function showMusicApp() {
    /* This function shows the music app after login or signup. */
    const app = document.querySelector(".spotifyPlaylists");
    if (app) app.style.display = "block";
}

function showUserEmail(email) {
    /* This function shows user email in the header and hides login/signup buttons. */
    const userEmail = document.getElementById("userEmail");

    if (userEmail) {
        userEmail.innerText = email;
        userEmail.style.display = "inline-block";
        userEmail.title = "Open Profile";
    }

    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (openLogin) openLogin.style.display = "none";
    if (openSignup) openSignup.style.display = "none";
}

function resetUserHeader() {
    /* This function resets the header when user logs out. */
    const userEmail = document.getElementById("userEmail");

    if (userEmail) {
        userEmail.innerText = "";
        userEmail.style.display = "none";
    }

    if (logoutBtn) logoutBtn.style.display = "none";
    if (openLogin) openLogin.style.display = "inline-block";
    if (openSignup) openSignup.style.display = "inline-block";
}

function openAuth(mode) {
    /* This function opens login or signup popup based on button clicked. */
    if (!authOverlay || !authTitle || !authSubmit || !authBox) return;

    authMode = mode;

    if (mode === "signup") {
        authTitle.innerText = "Create Account";
        authSubmit.innerText = "Sign Up";
        authBox.classList.add("signup");
    } else {
        authTitle.innerText = "Login Required";
        authSubmit.innerText = "Login";
        authBox.classList.remove("signup");
    }

    authOverlay.classList.add("show");
}

function closeAuthPopup() {
    /* This function closes the login or signup popup. */
    if (authOverlay) {
        authOverlay.classList.remove("show");
    }
}

function saveLoginDate() {
    /* This function saves the latest login date, so profile page can show last login. */
    localStorage.setItem("lastLoginDate", new Date().toLocaleString());
}

function setupAuthSystem() {
    /* This function handles signup, login, logout, and popup opening. */
    if (openLogin) {
        openLogin.addEventListener("click", () => openAuth("login"));
    }

    if (openSignup) {
        openSignup.addEventListener("click", () => openAuth("signup"));
    }

    if (closeAuth) {
        closeAuth.addEventListener("click", closeAuthPopup);
    }

    if (authOverlay) {
        authOverlay.addEventListener("click", (e) => {
            if (e.target === authOverlay) {
                closeAuthPopup();
            }
        });
    }

    if (authSubmit) {
        authSubmit.addEventListener("click", async () => {
            let email = authEmail.value.trim();
            let password = authPassword.value.trim();
            let confirm = confirmPassword.value.trim();

            if (email === "" || password === "") {
                showToast("Enter email and password");
                return;
            }

            if (!email.endsWith("@gmail.com")) {
                showToast("Enter valid Gmail ID");
                return;
            }

            if (authMode === "signup") {
                if (confirm === "") {
                    showToast("Reconfirm your password");
                    return;
                }

                if (password !== confirm) {
                    showToast("Passwords do not match");
                    return;
                }

                localStorage.setItem("pandafiEmail", email);
                localStorage.setItem("pandafiPassword", password);
                localStorage.setItem("pandafiLoggedIn", "true");
                saveLoginDate();

                showToast("Signup successful ✅");
                showUserEmail(email);
                showMusicApp();
                closeAuthPopup();

                authEmail.value = "";
                authPassword.value = "";
                confirmPassword.value = "";

                await main();
                return;
            }

            if (authMode === "login") {
                let savedEmail = localStorage.getItem("pandafiEmail");
                let savedPassword = localStorage.getItem("pandafiPassword");

                if (email === savedEmail && password === savedPassword) {
                    localStorage.setItem("pandafiLoggedIn", "true");
                    saveLoginDate();

                    showToast("Login successful ✅");
                    showUserEmail(email);
                    showMusicApp();
                    closeAuthPopup();

                    authEmail.value = "";
                    authPassword.value = "";
                    confirmPassword.value = "";

                    await main();
                } else {
                    showToast("Email or password wrong");
                }
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.setItem("pandafiLoggedIn", "false");
            currentSong.pause();

            if (playBtn) playBtn.src = "play.svg";

            hideMusicApp();
            resetUserHeader();
            showToast("Logged out 👋");
            openAuth("login");
        });
    }
}

function setupProfilePageOpen() {
    /* This function opens profile.html when user clicks their email in the header. */
    if (!userEmailBtn) return;

    userEmailBtn.addEventListener("click", () => {
        window.location.href = "profile.html";
    });
}

function setupFooter() {
    /* This function adds footer links into the library bottom area. */
    const footer = document.querySelector(".footer");

    if (!footer) return;

    footer.innerHTML = `
        <div><a href="#" onclick="alert('This is legal. Enjoy music 🎵')"><span>Legal</span></a></div>
        <div><a href="#" onclick="alert('Pandafi Music Player ❤️')"><span>About</span></a></div>
        <div><a href="#" onclick="alert('Built using HTML CSS JavaScript')"><span>Developer</span></a></div>
        <div><a href="#" onclick="alert('More updates coming soon 🔥')"><span>Updates</span></a></div>
        <div><a href="#" onclick="alert('Thanks for using Pandafi 🎵')"><span>Support</span></a></div>
    `;
}

async function main() {
    /* This function starts the music app one time and connects all main app features. */
    if (appStarted) return;

    appStarted = true;

    await getSongs("songs/ncs");

    let lastSong = localStorage.getItem("lastSong");
    let lastFolder = localStorage.getItem("lastFolder");

    if (lastSong && lastFolder && lastFolder !== "likedSongs") {
        await getSongs(lastFolder);
        playMusic(lastSong, true);
    } else if (songs.length > 0) {
        playMusic(songs[0], true);
    }

    setupLikedCardImage();
    loadUserPlaylists();
    setupPlaybarPlaylistSelect();
    setupSearch();
    setupCards();
    setupLikedCard();
    setupPlayPause();
    setupTimeUpdate();
    setupSeekbar();
    setupPlayerButtons();
    setupVolume();
    setupKeyboardShortcuts();
    setupSidebar();
    setupTheme();
    setupSpeedControl();
    setupVisualizer();

    const createPlaylistBtn = document.getElementById("createPlaylistBtn");

    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener("click", createUserPlaylist);
    }
}

function startAppByLoginStatus() {
    /* This function checks login status and decides whether to open app or login popup. */
    const savedEmail = localStorage.getItem("pandafiEmail");
    const isLoggedIn = localStorage.getItem("pandafiLoggedIn");

    if (savedEmail && isLoggedIn === "true") {
        showUserEmail(savedEmail);
        showMusicApp();
        main();
    } else {
        hideMusicApp();
        resetUserHeader();
        openAuth("login");
    }
}

setupAuthSystem();
setupProfilePageOpen();
setupFooter();
startAppByLoginStatus();

