var PollView = Backbone.View.extend({

	el: '#poll_content',

	tpl: _.template($("#poll-template").html()),

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
    	this.$el.html(this.tpl(this.model.toJSON()));
    }

});