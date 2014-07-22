var socket;
var poll;
var words;
$(document).ready(function(){
    socket = io.connect();
    socket.emit('connect');

    // Register web socket event functions
    socket.on('updatepoll', Events.updatePoll);
    socket.on('nextword', Events.showNextWord);

    // Register form submit functionality
    $('#vote-form').submit(function(event) {
        Events.sendVote($('#vote-input').val());

        // Clear the text field
        $('#vote-input').val("");

        // Don't make a post request
        return false;
    });
    

    // Set up backbone models and views
    poll = new Poll();
    var poll_view = new PollView({model: poll});

    // Fetch previous words
    var prev_words = null;
    $.ajax({
        url: '/words',
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function(data) {
            prev_words = data;
        }
    });

    words = new Words({'prev_words': prev_words});
    var words_view = new WordsView({model: words});
});
