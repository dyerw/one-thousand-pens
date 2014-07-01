// Events is a collection of functions for handling
// the events triggered by socket.io or for emitting
// new events from ui input
var Events = {

    /* Sends a vote for a word to the server
     * @param {string} wordVote the word the user is voting for
     */
    sendVote: function(wordVote) {
        // Make sure it's just one word
        if (wordVote.split(" ").length != 1) {
           // TODO: alert the user somehow 
           return
        }

        socket.emit('vote', {word: wordVote});
    },

    updatePoll: function(event) {
        console.log(event);
    }
}
