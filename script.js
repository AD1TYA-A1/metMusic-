console.log("Script is runnning");
let currentFolder = "rndm";
let currentSong = new Audio();
async function getSongs(folder) {
  currentFolder = folder
  let a = await fetch(`${currentFolder}`);
  let reply = await a.text();
  let s = document.createElement("div");
  s.innerHTML = reply;
  let as = s.getElementsByTagName("a");
  // console.log(as);
  let Songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      Songs.push(element.href.split(`/${currentFolder}/`)[1]);
    }
  }

  return Songs;
}

const playMusic = (track, pause = true) => {
  currentSong.src = `/${currentFolder}/` + track;
  currentSong.play();
  document.querySelector(".songInfo").innerText = track
    .replaceAll("%20", " ");
  if (!pause) {
    currentSong.play();
  }
};

async function main() {
  let songs = await getSongs((`Songs/${currentFolder}`).replace("/Songs/", "/"));
  playMusic(songs[0], true);
  // console.log(songs);
  //Show All Songs In The Playlist
  let songUl = document.querySelector(".a2a").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                                    <img class="invert" src="SVGs/music.svg" alt="music">
                                <div class="info">
                                    <div class="songName">   ${song.replaceAll(
        "%20",
        " "
      )}
 </div>
                                    <div class = "songArtist">Admin</div>
                                </div>
                                <div class="playNow">
                                <img class="invert " src="SVGs/play.svg" alt="playNow">
                                </div>

    </li>`;
  }
  //Attach EventListner To Each Of The Song
  Array.from(document.querySelector(".a2a").getElementsByTagName("li")).forEach(
    (e) => {
      e.addEventListener("click", (z) => {
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        let sngName = document.querySelector(".songInfo");
        sngName.innerText = e
          .querySelector(".info")
          .firstElementChild.innerHTML.trim();
        document.querySelector("#playsvg").src = "SVGs/pause.svg";
      });
    }
  );

  //PLAY PAUSE
  let p = document.getElementById("playsvg");
  p.addEventListener("click", () => {

    if (currentSong.paused) {
      currentSong.play();
      p.src = "SVGs/pause.svg";
    } else {
      currentSong.pause();
      p.src = "SVGs/play.svg";
    }
  });  //Duration
  //UPDATING TIME TO TOTAL TIME
// Replace your loadedmetadata event listener with this corrected version:

currentSong.addEventListener("loadedmetadata", () => {
    const duration = currentSong.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    document.querySelector(".endTime").innerText =
      "/" + minutes + ":" + seconds;
      
    // To Update Time(REALTIME) - REMOVED THE BROKEN WHILE LOOP
    currentSong.addEventListener("timeupdate", () => {
      const currentPlayTime = currentSong.currentTime;
      
      // REMOVED THIS BROKEN CODE:
      // while (currentPlayTime == duration) {
      //   let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
      //   if ((index + 1) > length) {
      //     playMusic(songs[index + 1]);
      //   }
      // }
      
      const currentTimeDisplay = document.querySelector(".realTime");
      let c = document.querySelector(".circle");
      c.style.left = (currentPlayTime / currentSong.duration) * 100 + "%";
      if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(currentPlayTime);
      }
    });
    
    // Formats time to min and seconds
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${remainingSeconds}`;
    }
});

// ADD THIS AUTO-PLAY CODE HERE - OUTSIDE AND AFTER the loadedmetadata listener
currentSong.addEventListener("ended", () => {
    console.log("Song ended, playing next...");

    // Get current song filename from the src URL
    let currentFileName = currentSong.src.split("/").slice(-1)[0];
    currentFileName = decodeURIComponent(currentFileName); // Handle encoded characters

    // Find current song index in the songs array
    let currentIndex = -1;
    for (let i = 0; i < songs.length; i++) {
        if (songs[i] === currentFileName || songs[i].replaceAll("%20", " ") === currentFileName.replaceAll("%20", " ")) {
            currentIndex = i;
            break;
        }
    }

    console.log("Current song index:", currentIndex);
    console.log("Total songs:", songs.length);

    if (currentIndex !== -1) {
        // Check if there's a next song
        if (currentIndex + 1 < songs.length) {
            // Play next song
            console.log("Playing next song:", songs[currentIndex + 1]);
            playMusic(songs[currentIndex + 1]);
        } else {
            // End of playlist - start from beginning
            console.log("End of playlist reached, starting from beginning");
            playMusic(songs[0]);
        }
    } else {
        // Fallback: if current song not found, play first song
        console.log("Current song not found in playlist, playing first song");
        if (songs.length > 0) {
            playMusic(songs[0]);
        }
    }
});

  //SEEKER
  let skr = document.querySelector(".seeker");
  skr.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Hamburger
  let ham = document.querySelector(".hamburger");
  ham.addEventListener("click", () => {
    document.querySelector(".box1").style.left = -7 + "px";

    document
      .querySelector(".cncl")
      .querySelector(".invert")
      .addEventListener("click", () => {
        document.querySelector(".box1").style.left = -700 + "px";
      });
  });

  //Previous
  document.querySelector(".previous").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //Next
  // Replace your existing Next button code with this:
  document.querySelector(".next").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if ((index + 1) < songs.length) {  // Changed from > to 
      playMusic(songs[index + 1]);
    } else {
      // If at end, go to first song
      playMusic(songs[0]);
    }
  });
  //Volume
  document.querySelector(".VolSeeker").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  })
  //dynamic album
  //ALBUM1
  document.querySelector(".song1").addEventListener("click", async (params) => {
    let boxx = document.querySelector(".box1");
    if (window.innerWidth < 1288) {
      boxx.style.left = 2 + "px";
    }
    document.querySelector(".cncl").addEventListener("click", () => {
      boxx.style.left = -2222 + "px";
    })

    currentFolder = "love";
    getSongs(`Songs/${currentFolder}`);
    songs = await getSongs(`${currentFolder}`);
    songUl.innerHTML = " ";
    for (const song of songs) {
      songUl.innerHTML =
        songUl.innerHTML +
        `<li>
                                      <img class="invert" src="SVGs/music.svg" alt="music">
                                  <div class="info">
                                      <div class="songName">   ${song.replaceAll(
          "%20",
          " "
        )}
   </div>
                                      <div class = "songArtist">Admin</div>
                                  </div>
                                  <div class="playNow">
                                  <img class="invert " src="SVGs/play.svg" alt="playNow">
                                  </div>
  
      </li>`;
    }
    playMusic(songs[0]);
    Array.from(document.querySelector(".a2a").getElementsByTagName("li")).forEach(
      (e) => {
        e.addEventListener("click", (z) => {
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
          let sngName = document.querySelector(".songInfo");
          sngName.innerText = e
            .querySelector(".info")
            .firstElementChild.innerHTML.trim();
        })
      });


  })
  //#ALBUM2
  document.querySelector(".song2").addEventListener("click", async (params) => {
    let boxx = document.querySelector(".box1");
    if (window.innerWidth < 1288) {
      boxx.style.left = 2 + "px";
    }
    document.querySelector(".cncl").addEventListener("click", () => {
      boxx.style.left = -2222 + "px";
    })

    currentFolder = "phonk";
    getSongs(`Songs/${currentFolder}`);
    songs = await getSongs(`${currentFolder}`);
    songUl.innerHTML = " ";
    for (const song of songs) {
      songUl.innerHTML =
        songUl.innerHTML +
        `<li>
                                    <img class="invert" src="SVGs/music.svg" alt="music">
                                <div class="info">
                                    <div class="songName">   ${song.replaceAll(
          "%20",
          " "
        )}
 </div>
                                    <div class = "songArtist">Admin</div>
                                </div>
                                <div class="playNow">
                                <img class="invert " src="SVGs/play.svg" alt="playNow">
                                </div>

    </li>`;
    }
    playMusic(songs[0]);
    Array.from(document.querySelector(".a2a").getElementsByTagName("li")).forEach(
      (e) => {
        e.addEventListener("click", (z) => {
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
          let sngName = document.querySelector(".songInfo");
          sngName.innerText = e
            .querySelector(".info")
            .firstElementChild.innerHTML.trim();
        })
      });


  })
  //#ALBUM3
  document.querySelector(".song3").addEventListener("click", async (params) => {
    let boxx = document.querySelector(".box1");
    if (window.innerWidth < 1288) {
      boxx.style.left = 2 + "px";
    }
    document.querySelector(".cncl").addEventListener("click", () => {
      boxx.style.left = -2222 + "px";
    })

    currentFolder = "punjabi";
    getSongs(`Songs/${currentFolder}`);
    songs = await getSongs(`${currentFolder}`);
    songUl.innerHTML = " ";
    for (const song of songs) {
      songUl.innerHTML =
        songUl.innerHTML +
        `<li>
                                    <img class="invert" src="SVGs/music.svg" alt="music">
                                <div class="info">
                                    <div class="songName">   ${song.replaceAll(
          "%20",
          " "
        )}
 </div>
                                    <div class = "songArtist">Admin</div>
                                </div>
                                <div class="playNow">
                                <img class="invert " src="SVGs/play.svg" alt="playNow">
                                </div>

    </li>`;
    }
    playMusic(songs[0]);
    Array.from(document.querySelector(".a2a").getElementsByTagName("li")).forEach(
      (e) => {
        e.addEventListener("click", (z) => {
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
          let sngName = document.querySelector(".songInfo");
          sngName.innerText = e
            .querySelector(".info")
            .firstElementChild.innerHTML.trim();
        })
      });


  });
  //#ALBUM4
  document.querySelector(".song4").addEventListener("click", async (params) => {
    let boxx = document.querySelector(".box1");
    if (window.innerWidth < 1288) {
      boxx.style.left = 2 + "px";
    }
    document.querySelector(".cncl").addEventListener("click", () => {
      boxx.style.left = -2222 + "px";
    })

    currentFolder = "bhakti";
    getSongs(`Songs/${currentFolder}`);
    songs = await getSongs(`${currentFolder}`);
    songUl.innerHTML = " ";
    for (const song of songs) {
      songUl.innerHTML =
        songUl.innerHTML +
        `<li>
                                    <img class="invert" src="SVGs/music.svg" alt="music">
                                <div class="info">
                                    <div class="songName">   ${song.replaceAll(
          "%20",
          " "
        )}
 </div>
                                    <div class = "songArtist">Admin</div>
                                </div>
                                <div class="playNow">
                                <img class="invert " src="SVGs/play.svg" alt="playNow">
                                </div>

    </li>`;
    }
    playMusic(songs[0]);
    Array.from(document.querySelector(".a2a").getElementsByTagName("li")).forEach(
      (e) => {
        e.addEventListener("click", (z) => {
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
          let sngName = document.querySelector(".songInfo");
          sngName.innerText = e
            .querySelector(".info")
            .firstElementChild.innerHTML.trim();
        })
      });


  });
}


main();
