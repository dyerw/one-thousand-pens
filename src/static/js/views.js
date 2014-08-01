var PollView = Backbone.View.extend({
    /*
     * A view to show the user what the current votes
     * for each word are.
     */

    el: '#poll-content',

    // TODO: find a better way to build template that still allows for unit testing
    tpl: _.template("<div id='vote-title'> Next Word </div>" +
                    // The countdown timer
                    "<div id='countdown-timer' style='width: <%-secs_left/max_seconds * 100%>%;'></div>" +
                    "<% for (i = 0; i < sorted_votes.length; i++) { " +
                    "var word = sorted_votes[i][0]; var votes = sorted_votes[i][1]; %>" +
                    "<div class='votes-display'>" +

                    // If the user hasn't voted, put the vote button in
                    "<% if (!has_voted) { %>" +
                    "<a class='vote-arrow' onclick='Events.sendVote(\"<%-word%>\");'>" +
                    "<img src='static/assets/uparrow.png'>" +
                    "</a>" +
                    "<% } %>" +

                    "<span class='vote-word'> <%-word%> </span>" +
                    "<span class='vote-number'> <%-votes%> </span>" +
                    "<div class='vote-percentage' style='width: <%-votes/max_vote * 100%>%;'></div>" +
                    "</div>" +
                    "<% } %>"),

    initialize: function() {
        // Render immediately even if there's no data yet
        this.render();

        // Update whenever the model changes
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        this.$el.html(this.tpl(this.model.getTemplateObject()));
    }

});


var WordsView = Backbone.View.extend({
    /*
     * A view to show the user what the previously
     * chosen words are.
     */

    el: '#story-content',

    tpl: _.template("<div id='chapters'><%-chapters%></div>"),

    initialize: function() {
        // Render immediately even if there's no data
        this.render();

        // Render whenever the model changes
        this.listenTo(this.model, "change", this.render);
    },

    format_text: function(text) {
        /*
         * Takes the list of words and properly spaces and concatenates
         * them, pushing punctuation onto the end of the last word
         */

        var formatted_text = "";
        for (var i = 0; i < text.length; i++) {
            var punctuation_match = text[i].match(/[.?,!;:"']+/);

            // If the match is the same length as the whole word,
            // the whole word is punctuation
            if (!(punctuation_match != null &&
                text[i].length == punctuation_match[0].length)) {
                formatted_text = formatted_text + " " + text[i];
            } else {
                formatted_text = formatted_text + text[i];
            }
        }

        return formatted_text;
    },

    chapterize_text: function(text) {
        var chapters = {};
        var last_chapter_title = "";
    },

    render: function() {
        this.$el.html(this.tpl({'chapters': this.chapterize_text(this.model.prev_words)}));
    }

});