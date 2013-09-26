(function ($, BB, _){
//alert("hello");

//OVERALL COMMENT VIEW
var commentListView = Backbone.View.extend({
	el: '#comments',
	events:{
		'click #subButt'	: 'addComments'
	},
	initialize:function(){
		this.$input_author = $('#author');
		this.$input_messege = $('#author');
		this.$input_list = $('#comment_list');
		this.$comment_counter = $('#comment_count');

		this.listenTo(this.collection, 'add', this.createCommentView);
		this.listenTo(this.collection, 'add remove', this.updateCommentCounter);
		this.collection.fetch();
	},
	addComments:function(e){
		e.preventDefault();
		var comment = new commentModel({
			author: this.$input_author.val(),
			time_elapsed: '0',
			message: this.$input_messege.val(),
			upvotes: 0
		});

		this.collection.add(comment);
		comment.save();
		this.clearFields();
	},
	createCommentView:function(model){
		var view = new commentView({model:model});
		this.$input_list.append(view.render().el);
	},
	clearFields:function(){
		this.$input_author.val('');
		this.$input_messege.val('');

	},
	updateCommentCounter: function(){
		this.$comment_counter.html(this.collection.length);
	}
});


//perCOMMENT view
var commentView = Backbone.View.extend({
	tagName: 'li',
	template: _.template($('#comment-template').html()),
	events:{
		'click .delete'	: 'removeFromDB',
		'click .upvote'	: 'increaseUpvote'
	},
	initialize:function(){
		this.listenTo(this.model, 'destroy', this.removeView);
	},
	render: function(){
		console.log(this.model.toJSON());
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	removeFromDB:function(){
		this.model.destroy({
			"url":this.model.url+'/'+this.model.id,
		});
	},
	removeView: function(){
		console.log("removed");
		this.undelegateEvents();
		this.stopListening();
		this.remove();
	},
	increaseUpvote: function(){
		//this.model.get() = this.model.toJSON().upvotes+1;
		this.model.get('upvotes'); 
		console.log(this.model.get('upvotes'));
	}
});

//COMMENT MODEL
var commentModel = Backbone.Model.extend({
	idAttribute: "_id",
	url:'http://localhost:9090/comments',
	defaults:{
		author:'-',
		time_elapsed: '-',
		message: '-',
		upvotes: '-'
	}
});


//COMMENT COLLECTION
var commentCollection = Backbone.Collection.extend({
	model: commentModel,
	url:'http://localhost:9090/comments',
	initialize: function(){

	}
});

var commentSys = new commentListView({collection:new commentCollection()});
})(jQuery, Backbone, _)