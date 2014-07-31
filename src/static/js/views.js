var PollView = Backbone.View.extend({
    /*
     * A view to show the user what the current votes
     * for each word are.
     */

    el: '#poll-content',

    tpl: _.template($("#poll-template").html()),

    initialize: function() {
        // Render immediately even if there's no data yet
        this.render();

        // Update whenever the model changes
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        this.$el.html(this.tpl(this.model.toJSON()));
    }

});


var WordsView = Backbone.View.extend({
    /*
     * A view to show the user what the previously
     * chosen words are.
     */

    el: '#story-content',

    tpl: _.template($("#words-template").html()),

    initialize: function() {
        // Render immediately even if there's no data
        this.render();

        // Render whenever the model changes
        this.listenTo(this.model, "change", this.render);
    },

    format_text: function() {
        /*
         * Takes the list of words and properly spaces and concatenates
         * them, pushing punctuation onto the end of the last word
         */

        var prev_words = this.model.get('prev_words');

        for (var i = 0; i < prev_words.length; i++) {
            var punctuation_match = prev_words[i].match(/[.?,!;:]+/);

            if (!(punctuation_match != null &&
                prev_words[i].length == punctuation_match[0].length)) {
                prev_words[i] = " " + prev_words[i];
            }
        }

        return prev_words
    },

    render: function() {
        var spaced_words = this.format_text();
        this.$el.html(this.tpl({'prev_words': spaced_words}));
    }

});