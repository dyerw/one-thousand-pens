var Poll = Backbone.Model.extend({
	defaults: {
        // An object where the key is a word
        // and the value is the number of votes.
        // This will be cleared every time a new
        // word is chosen.
		'votes': {},

        // Approx. number of seconds until
        // next vote is selected
        'secs_left': 0,

        'max_seconds': 15,

        'has_voted': false
	},

    getSortedVotes: function() {
        // Sort the object into an array by number of votes
        var sorted_votes = [];
        for (var word in this.get('votes')) {
            sorted_votes.push([word, this.get('votes')[word]]);
        }
        sorted_votes.sort(function(a, b) {return b[1] - a[1]});

        return sorted_votes;
    },

    getTopVote: function() {
        var top_vote = 0;
        for (var word in this.get('votes')) {
            if (this.get('votes')[word] > top_vote) {
                top_vote = this.get('votes')[word];
            }
        }

        return top_vote;
    },

    getTemplateObject: function() {
        return {'sorted_votes': this.getSortedVotes(),
                'max_vote': this.getTopVote(),
                'secs_left': this.get('secs_left'),
                'max_seconds': this.get('max_seconds'),
                'has_voted': this.get('has_voted')}
    }
});

var Words = Backbone.Model.extend({
    defaults: {
        // A list of all previously chosen words.
        // These are displayed to the user in order.
        'prev_words': []
    }
});