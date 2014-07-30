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
	}
});

var Words = Backbone.Model.extend({
    defaults: {
        // A list of all previously chosen words.
        // These are displayed to the user in order.
        'prev_words': []
    }
});