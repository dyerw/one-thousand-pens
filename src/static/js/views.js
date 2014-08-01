/*
 * A view to show the user what the current votes
 * for each word are.
 */
var PollView = Backbone.View.extend({

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

/*
 * A view to show the user what the previously
 * chosen words are.
 */
var WordsView = Backbone.View.extend({

    el: '#story-content',

    tpl: _.template(""),

    initialize: function() {
        // Render immediately even if there's no data
        this.render();

        // Render whenever the model changes
        this.listenTo(this.model, "change", this.render);
    },

    /*
     *  Returns true if the given text is only comprised
     *  of punctuation.
     */
    isPunctuation: function(text) {
        var punctuation_match = text.match(/[.?,!;:"']+/);

        return punctuation_match != null && text.length == punctuation_match[0].length;
    },

    /*
     * Takes the list of words and properly spaces and concatenates
     * them, pushing punctuation onto the end of the last word
     */
    formatText: function(text) {

        var formatted_text = "";
        for (var i = 0; i < text.length; i++) {
            var punctuation_match = text[i].match(/[.?,!;:"']+/);

            // If the match is the same length as the whole word,
            // the whole word is punctuation
            if ((punctuation_match != null &&
                 text[i].length == punctuation_match[0].length) ||
                 formatted_text == "") {
                formatted_text = formatted_text + text[i];
            } else {
                formatted_text = formatted_text + " " + text[i];
            }
        }

        return formatted_text;
    },

    /*
     * Takes the list of words in the model and sorts it into a list categorized
     * by type. The three types are 'title', 'subtitle', and 'text'. This creates
     * a list of lists where each sub-list is only of length two: a type and some
     * content.
     *
     *  The types are defined as follows:
     *     title:    the word "chapter" with any casing and the word immediately following it,
     *               if a colon follows it the colon is included, if there is no colon one is added
     *     subtitle: the next string of words following the title until either a punctuation or a
     *               length of ten words
     *     text:     everything else
     */
    //FIXME: Handle hanging "chapter"
    getContentList: function() {
        var words = this.model.get('prev_words');
        var contentList = [];

        // We start this at 8 so a chapter can happen
        // as the first thing
        var wordsSinceChapter = 8;
        var textBlock = [];
        var inSubtitle = false;
        var subtitleBlock = [];

        for (var i = 0; i < words.length; i++) {
            var word = words[i];
            // We're in a subtitle
            if (inSubtitle) {
                // Check if the subtitle is over
                if (subtitleBlock.length > 9 || this.isPunctuation(word)) {
                    if (this.isPunctuation(word)) {
                        subtitleBlock.push(word);
                    } else {
                        textBlock.push(word);
                    }

                     var subtitle = ['subtitle', this.formatText(subtitleBlock)];
                    contentList.push(subtitle);

                    subtitleBlock = [];
                    inSubtitle = false;

                } else {
                    subtitleBlock.push(word);
                }

            // This is a Chapter
            } else if (word.toLowerCase() == 'chapter' && wordsSinceChapter > 7) {
                // Add the accumulated text block to the list and add the chapter
                // title
                var text = ['text', this.formatText(textBlock)];
                var title = ['title', word + " " + words[i + 1] + ":"];

                contentList.push(text);
                contentList.push(title);

                wordsSinceChapter = 0;
                textBlock = [];
                inSubtitle = true;

                // Check if the users supplied a colon two words ahead
                // and skip ahead the proper amount
                if (words[i + 2] == ':') {
                    i = i + 2;
                } else {
                    i = i + 1;
                }

            // This is not a Chapter, just add the word to the
            // text block accumulator
            } else {
                console.log(word);
                textBlock.push(word);
                wordsSinceChapter++;
            }
        }

        // If we cut out in the middle of a subtitle
        // or text block, push the rest onto the end
        if (inSubtitle) {

        } else {
            text = ['text', this.formatText(textBlock)];
            contentList.push(text);
        }


        return contentList;
    },

    render: function() {
        this.$el.html(this.tpl({'content': this.getContentList()}));
    }

});