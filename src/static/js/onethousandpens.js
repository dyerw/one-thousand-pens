var socket;
$(document).ready(function(){
    socket = io.connect();

    // Register web socket event functions
    socket.on('updatepoll', Events.updatePoll);
    //socket.on('nextword', Events.showNextWord(event));

    // Register form submit functionality
    $('#vote_form').submit(function(event) {
        Events.sendVote($('#vote_input').val());
        $('#vote_input').val("");
        // Don't make a post request
        return false;
    });

    // Set up backbone models and views
    poll = new Poll();
    poll_view = new PollView({model: poll});
});
