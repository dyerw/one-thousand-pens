$(document).ready(function(){
    var socket = io.connect();

    // Register web socket event functions
    socket.on('updatepoll', updatePoll(event));
    socket.on('nextword', showNextWord(event));

    // Register form submit functionality
    $('vote_form').submit(function(event) {
        socket.emit('vote', {data: $('#vote_input').val()});

        // Don't make a post request
        return false;
    });
});

function updatePoll(event) {

}

function showNextWord(event) {

}