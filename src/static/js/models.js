var Poll = Backbone.Model.extend({
	defaults: {
		'votes': {}
	}
});

var Words = Backbone.Model.extend({
    defaults: {
        'prev_words': []
    }
});