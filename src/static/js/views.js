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

    render: function() {
        this.$el.html(this.tpl(this.model.toJSON()));
    }

});