var PollView = Backbone.View.extend({

    el: '#poll-content',

    tpl: _.template($("#poll-template").html()),

    initialize: function() {
        this.render();
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        this.$el.html(this.tpl(this.model.toJSON()));
    }

});


var WordsView = Backbone.View.extend({

    el: '#story-content',

    tpl: _.template($("#words-template").html()),

    initialize: function() {
        this.render();
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        this.$el.html(this.tpl(this.model.toJSON()));
    }

});