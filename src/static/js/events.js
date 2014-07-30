// Events is a collection of functions for handling
// the events triggered by socket.io or for emitting
// new events from ui input
var Events = {

    /*
     * Sends a vote for a word to the server
     * @param {string} wordVote the word the user is voting for
     */
    sendVote: function(wordVote) {
        // Make sure there's at least one character
        if (wordVote == "") {
            return
        }

        // Make sure it's just one word
        if (wordVote.split(" ").length != 1) {
           // TODO: alert the user somehow 
           return
        }

        poll.set('has_voted', true);
        socket.emit('vote', {word: wordVote});
    },

    /*
     * Updates the poll to reflect the new vote counts.
     * @param {object} event the event object given from the socket
     *                       that should contain the new vote numbers
     */
    updatePoll: function(event) {
        poll.set({votes: event.votes});
    },

    /*
     * Adds the newest word to the text content when it is chosen.
     * @param {object} event the event object given from the socket
     *                       should contain the newest word
     */
    showNextWord: function(event) {
        poll.set({votes: {}});
        poll.set('has_voted', false);
        poll.set({secs_left: NEXT_WORD_FREQ});
        words.set({prev_words: words.get('prev_words').concat([event.word])});
    },

    /*
     * Decrements number of seconds until next vote goes through
     */
    countdown: function() {
        var secs_left = poll.get('secs_left');
        if (secs_left != 0) {
            poll.set({secs_left: secs_left - 0.5});
        }
    }
};
