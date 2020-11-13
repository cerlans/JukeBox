//#1F305E
//global variables
var divs = document.getElementsByClassName('items');

// the current time off the audio
var currentTime = document.getElementById('current');

//the duration off the song
var duration = document.getElementById('duration')

var seeking = document.getElementById('seekBar');
seeking.addEventListener('click', function() {
    console.log(this)
})

var shuffleButton = document.getElementById('random')


var inputUpload = document.getElementById("check");
inputUpload.addEventListener('change', fileRead);



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

//for grabbing the closest audio selected
var container = document.getElementById('container');
// variable for song currently selected
let song
//processes,plays, and also adds timetracking to currentSong selected
function songSelect(e) {
    let node = e.target.closest(".items");

    if (node) {
        song = node.querySelector("div>audio");
        song.play()
        duration.innerHTML = timeFormat(song.duration)
        song.addEventListener('timeupdate', seekBarstatus)
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

// updates the time, off each song, with timeupdate event
//sets the current time to the spans next to seekbar
//adjust the seekbar dial to the current time, and duration off the song
//also moves the dial on the seekbar
function seekBarstatus() {
    currentTime.innerHTML = timeFormat(song.currentTime);
    seekBar.max = song.duration
    seekBar.value = song.currentTime;
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

console.log(playButton);