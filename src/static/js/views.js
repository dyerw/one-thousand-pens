var PollView = Backbone.View.extend({

	el: '#poll_content',

	tpl: _.template($("#poll-template").html()),

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
    	console.log("rendering");
    	console.log(this.model.get('votes'));
    	console.log(this.tpl(this.model.get('votes')));
    	this.$el.html(this.tpl(this.model.toJSON()));
    }

});