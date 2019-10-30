function sendmsgtoscreen(msg,side)
{
//alert("The side is " +side);

if(side == "right"){
var newDiv = document.createElement("div");
var parentDiv = document.getElementById('div1');
var d = new Date();
minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
ampm = d.getHours() >= 12 ? 'pm' : 'am',
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var m = ' '+hours+':'+minutes+ampm;
newDiv.innerHTML = '<div class="d-flex justify-content-end mb-4"> <div class="msg_cotainer_send"> '+msg+' <span class="msg_time_send">'+m+'</span> </div> </div>';
parentDiv.appendChild(newDiv);
scrollDown();

}



else{

var newDiv = document.createElement("div");
var parentDiv = document.getElementById('div1');
var d = new Date();
minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
hours = d.getHours().toString().length == 1 ? '0'+d.getHours() : d.getHours(),
ampm = d.getHours() >= 12 ? 'pm' : 'am',
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var m = ' '+hours+':'+minutes+ampm;
newDiv.innerHTML ='<div class="d-flex justify-content-start mb-4">  <div class="msg_cotainer">'+msg+' <span class="msg_time">'+m+'</span> </div> </div>';
    parentDiv.appendChild(newDiv);
    scrollDown();


 }

}


try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}


var instructions = $('#recording-instructions');
var notesList = $('ul#notes');

var noteContent = '';

// Get all notes from previous sessions and display them.
//var notes = getAllNotes();
//renderNotes(notes);






/*-----------------------------
      Voice Recognition
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses.
recognition.continuous = true;

// This block is called every time the Speech APi captures a line.
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;
  console.log(transcript);

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
 
 
 
 

if(!mobileRepeatBug) {
    
sendmsgtoscreen(transcript, "right");
$.ajax({
url:"chatbotconnection.php", //the page containing php script
type: "post", //request type,
data: ({'message':transcript,}),
success:function(result){
//console.log("The Result is"+result);
//result = JSON.parse(result);
//result=(result.output);

var obj = JSON.parse(result);
console.log(obj);
var message=(obj.output.text);
sendmsgtoscreen(message , "left");
readOutLoud(message);

  }
});

  }
 
};

recognition.onstart = function() {
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}



/*-----------------------------
      App buttons and input
------------------------------*/

$('#record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
  document.getElementById('micicon').className="fa fa-spinner fa-spin";
  document.getElementById('record-btn').disabled = true;
  setTimeout(function() {
  recognition.stop();
 
  document.getElementById('record-btn').disabled = false;
  document.getElementById('micicon').className="fas fa-microphone";
}, 5000);

 
});


$('#arecord-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
  //detectSilence();
});


$('#save-note-btn').on('click', function(e) {
  recognition.stop();

  if(!noteContent.length) {
    instructions.text('Could not save empty note. Please add a message to your note.');
  }
  else {
    // Save note to localStorage.
    // The key is the dateTime with seconds, the value is the content of the note.
    saveNote(new Date().toLocaleString(), noteContent);

    // Reset variables and update UI.
    noteContent = '';
    renderNotes(getAllNotes());
   // noteTextarea.val('');
    instructions.text('Note saved successfully.');
  }
     
})


notesList.on('click', function(e) {
  e.preventDefault();
  var target = $(e.target);

  // Listen to the selected note.
  if(target.hasClass('listen-note')) {
    var content = target.closest('.note').find('.content').text();
    readOutLoud(content);
  }

  // Delete note.
  if(target.hasClass('delete-note')) {
    var dateTime = target.siblings('.date').text();  
    deleteNote(dateTime);
    target.closest('.note').remove();
  }
});



/*-----------------------------
      Speech Synthesis
------------------------------*/

function readOutLoud(message) {
var speech = new SpeechSynthesisUtterance();
speechSynthesis.speak(new SpeechSynthesisUtterance(message));

  // Set the text and voice attributes.
speech.text = message;
speech.volume = 1;
speech.rate = 1;
speech.pitch = 1;
 
//window.speechSynthesis.speak(speech);
speech.addEventListener('end', function(event) {
document.getElementById('record-btn').disabled = false;
document.getElementById('micicon').className="fas fa-microphone";
});

}



/*-----------------------------
      Helper Functions
------------------------------*/

function renderNotes(notes) {
  var html = '';
  if(notes.length) {
    notes.forEach(function(note) {
      html+= `<li class="note">
        <p class="header">
          <span class="date">${note.date}</span>
          <a href="#" class="listen-note" title="Listen to Note">Listen to Note</a>
          <a href="#" class="delete-note" title="Delete">Delete</a>
        </p>
        <p class="content">${note.content}</p>
      </li>`;    
    });
  }
  else {
    html = '<li><p class="content">You don\'t have any notes yet.</p></li>';
  }
  notesList.html(html);
 
}
/*function detectSilence(){
  stream
  onSoundEnd = _=>{}
  onSoundStart = _=>{}
  silence_delay = 500;
  min_decibels = -80;
  recognition.stop();
}*/

function saveNote(dateTime, content) {
  localStorage.setItem('note-' + dateTime, content);
}

 
     


function getAllNotes() {
  var notes = [];
  var key;
  for (var i = 0; i < localStorage.length; i++) {
    key = localStorage.key(i);

    if(key.substring(0,5) == 'note-') {
      notes.push({
        date: key.replace('note-',''),
        content: localStorage.getItem(localStorage.key(i))
      });
    }
  }
  return notes;
}


function deleteNote(dateTime) {
  localStorage.removeItem('note-' + dateTime);
}

function scrollDown() {
  const $container = $("#div1");
  const $maxHeight = $container.height();
  const $scrollHeight = $container[0].scrollHeight;
  if ($scrollHeight > $maxHeight) $container.scrollTop($scrollHeight);
}


function markorder(item , price){
  // alert(item);
 
Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to cancle this!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Place order'
}).then((result) => {
  if (result.value) {
     
  $.ajax({
url:"storefoodorder.php", //the page containing php script
type: "post", //request type,
data: ({'item':item,}),
success:function(result){
 Swal.fire(
      'order placed',
      'Your item has been orderd successfully.',
      'success'
    )
}
 
});
  }
})



}



$(document).ready(function(){


  /* Toggle Video Modal
  -----------------------------------------*/
  function toggle_video_modal() {
      
      // Click on video thumbnail or link
      $(".js-trigger-video-modal").on("click", function(e){
          
          // prevent default behavior for a-tags, button tags, etc. 
          e.preventDefault();
        
          // Grab the video ID from the element clicked
          var id = $(this).attr('data-youtube-id');

          // Autoplay when the modal appears
          // Note: this is intetnionally disabled on most mobile devices
          // If critical on mobile, then some alternate method is needed
          var autoplay = '?autoplay=1';

          // Don't show the 'Related Videos' view when the video ends
          var related_no = '&rel=0';

          // String the ID and param variables together
          var src = '//www.youtube.com/embed/'+id+autoplay+related_no;
          
          // Pass the YouTube video ID into the iframe template...
          // Set the source on the iframe to match the video ID
          $("#youtube").attr('src', src);
          
          // Add class to the body to visually reveal the modal
          $("body").addClass("show-video-modal noscroll");
      
      });

      // Close and Reset the Video Modal
      function close_video_modal() {
        
        event.preventDefault();

        // re-hide the video modal
        $("body").removeClass("show-video-modal noscroll");

        // reset the source attribute for the iframe template, kills the video
        $("#youtube").attr('src', '');
        
      }
      // if the 'close' button/element, or the overlay are clicked 
      $('body').on('click', '.close-video-modal, .video-modal .overlay', function(event) {
          
          // call the close and reset function
          close_video_modal();
          
      });
      // if the ESC key is tapped
      $('body').keyup(function(e) {
          // ESC key maps to keycode `27`
          if (e.keyCode == 27) { 
            
            // call the close and reset function
            close_video_modal();
            
          }
      });
  }
  toggle_video_modal();



});


function opennews(news) {
  document.getElementById('newsmodal').innerHTML = "";
  document.getElementById('newsmodal').innerHTML = news;
}

// function feedbackform(field1, field2, field3, field14) {
// Swal.mixin({
//   input: 'text',
//   confirmButtonText: 'Next &rarr;',
//   showCancelButton: true,
//   progressSteps: ['1', '2', '3']
// }).queue([
//   const { value: fruit } = await Swal.fire({
//   title: 'Select field validation',
//   input: 'select',
//   inputOptions: {
//     apples: 'Apples',
//     bananas: 'Bananas',
//     grapes: 'Grapes',
//     oranges: 'Oranges'
//   },
//   inputPlaceholder: 'Select a fruit',
//   showCancelButton: true,
//   inputValidator: (value) => {
//     return new Promise((resolve) => {
//       if (value === 'oranges') {
//         resolve()
//       } else {
//         resolve('You need to select oranges :)')
//       }
//     })
//   }
// })

// if (fruit) {
//   Swal.fire('You selected: ' + fruit)
// },
//   'Question 2',
//   'Question 3'
// ]).then((result) => {
//   if (result.value) {
//     Swal.fire({
//       title: 'All done!',
//       html:
//         'Your answers: <pre><code>' +
//           JSON.stringify(result.value) +
//         '</code></pre>',
//       confirmButtonText: 'Lovely!'
//     })
//   }
// })
  

// }