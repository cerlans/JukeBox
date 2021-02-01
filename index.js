
//global variables

// a LIVE html collection off the div's with the class of 'items'
var divs = document.getElementsByClassName('items');

// the current time off the audio
var currentTime = document.getElementById('current');

//the duration off the song
var duration = document.getElementById('duration')

// input type range bar, changes its state to the current audio playing
var seeking = document.getElementById('seekBar');

// the shuffle icon
var shuffleButton = document.getElementById('random')

//file reader-upload button
var inputUpload = document.getElementById("check");
inputUpload.addEventListener('change', fileRead);

let songTitle = document.getElementById('currentSongName')


//creates a file reader that processes the file given to it by the user
//creates a div with class of 'item' and p tag with the name off the file
function fileRead() {
    const reader = new FileReader()
    reader.onload = function() {
        var result = reader.result;
        //result is asynchronous, but it seems to finish processing
        // by this line
        rest(result)
    }

    function rest(param) {
        var audioPlayer = new Audio(param);
        child.appendChild(audioPlayer);
        console.log(audioPlayer);
    }

    reader.readAsDataURL(inputUpload.files[0])
    //child container
    let child = document.createElement('div');
    child.classList.add('items');
    //overall parent
    let parent = document.getElementById('container');
    parent.appendChild(child);
    let paragraph = document.createElement('p');
    paragraph.innerHTML = inputUpload.files[0].name
    child.appendChild(paragraph)
}


//for grabbing the closest audio selected
var container = document.getElementById('container');

// variable for song currently selected
let song

//processes,plays, and also adds timetracking to currentSong selected
function songSelect(e) {
    let node = e.target.closest(".items"); //grabs closest div with the .items class

    if (node) {
        song = node.querySelector("div>audio"); //

        let songName = node.querySelector('div>p') //grabs the closest p tag within the same div as the audio
        
        
        songTitle.innerText = songName.innerText 

        song.play()
        duration.innerHTML = timeFormat(song.duration)
        song.addEventListener('timeupdate', seekBarStatus)



        //resets the icons to default state if song is changed while another song is currently playing
        if (song.play) {
            document.getElementById('pauseButt').style.display = 'inline-block';
            document.getElementById('playButt').style.display = 'none';
        }
        
    }
}


// for controlling the play button only
//since the song already plays in the songSelect() function, this is only in charge of the mouse clicks on the play icon
// is this efficient? almost all off the control for the song, is dependent on the songSelect function
function play() {
    song.play()
    if (song.play) {
        document.getElementById('playButt').style.display = 'none';
        document.getElementById('pauseButt').style.display = 'inline-block'
    }
    
}

// for controlling the pause button only

function pause() {
    song.pause()
    if (song.pause) {
        document.getElementById('pauseButt').style.display = 'none';
        document.getElementById('playButt').style.display = ' inline-block';
    }
}
//returns a live collection of div's container '.items' class
let activeIndex = 0;
  //numbered variable for shifting through the song index
function currentActiveIndex(){
    [...divs].forEach(function(el, index) {
       
              if (el.classList.contains('item--active')) {
                     console.log(el)
                  return activeIndex = index
                  
              }
          })
          return activeIndex;
}
// updates the time, off each song, with timeupdate event
//sets the current time to the spans next to seekbar
//adjust the seekbar dial to the current time, and duration off the song
//also moves the dial on the seekbar
function seekBarStatus() {
    currentTime.innerHTML = timeFormat(song.currentTime);
    seekBar.max = song.duration
    seekBar.value = song.currentTime;

    if(song.currentTime === song.duration) {
        pause();
    }
}

//loops through the audio files, and checks for which one is currently playing
//stops all the others
//issue, the audio doesn't start from the beginning if you select a song, and than reselct previous

//shuffles the content off the divs containing songs
function domShuffle() {
    
    var parent = document.getElementById("container");
    var divs = parent.children;
    var frag = document.createDocumentFragment();
    while (divs.length) {
        frag.appendChild(divs[Math.floor(Math.random() * divs.length)]);
    }
    parent.appendChild(frag);
}

// time formatter that outputs the given song duration into hours, mins, and seconds
function timeFormat(duration)

{
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}


//event listeners + functions
let playButton = document.getElementById('playButt');
playButton.addEventListener('click', play)
let pauseButton = document.getElementById('pauseButt');
pauseButton.addEventListener('click', pause);

//whole body eventListner for the document, verifies whether a song is currently playing
//pauses every othersong besides the song currently playing
//resets the time off every other song that isn't selected
document.addEventListener('play', function(e) {
    var audios = document.getElementsByTagName('audio');
    //retrieves all the audio tags, in my context thats 3
    for (var i = 0, len = audios.length; i < len; i++) {
        //standard for loop 
        if (audios[i] != e.target) {
            audios[i].pause();
            audios[i].currentTime = 0;
        }
    }
}, true);
container.addEventListener('click', songSelect);

seeking.addEventListener('change', function() {
    song.currentTime = seeking.value
    
})

shuffleButton.addEventListener('click', domShuffle)
// the const variables below control the previous and next buttons in the controls
// it shifts through the songs while adding a visual highlight into the current position it is in
// we are shifting the the global 'divs' variable which is an html collection of div's that contain the audio name, and file

const next = document.getElementById('next')
next.addEventListener('click', function() {
    currentActiveIndex();
    // the above function runs, and does everything that was described above before moving along. the first element off the list contains the class 'item active'
    console.log(this)
    divs[activeIndex].classList.remove('item--active');
    // and since the first item will always contain the item active class, it will always start from zero, remove that class from the zero'th list item
    if ((activeIndex + 1) <= divs.length) {
        divs[activeIndex + 1].classList.add('item--active');
        ++activeIndex
        divs[activeIndex].children[1].play()
        let song = divs[activeIndex].children[1];
        console.log(song)
       
    } else {
        divs[divs.length].classList.add('item--active'); 
    }
})

const previous = document.getElementById('previous')
previous.addEventListener('click', function(){
    currentActiveIndex();
    console.log(activeIndex)
    divs[activeIndex].classList.remove('item--active');
    if ((activeIndex - 1) >= 0) {
        divs[activeIndex - 1].classList.add('item--active');
        --activeIndex
        divs[activeIndex].children[1].play()
    } else {
        divs[0].classList.add('item--active');
    }
})



container.addEventListener('click', function(event) {
    //can a switch statement be used here instead?
    if (event.target.className === 'items') {
        event.target.classList.add('item--active');
        console.log(this)
        //functional, just the padding around the elements is small so i have to click a certain area
        // how to make anything that was clicked the clickable area?
        // add another line that removes any instances off the class when the event target is clicked
    }

    // removes the class from other elements if it isn't the target
    for (var i = 0, len = divs.length; i < len; i++) {
       
        if (divs[i] != event.target) {
            divs[i].classList.remove('item--active');
                }
    }
})
console.log(playButton);
