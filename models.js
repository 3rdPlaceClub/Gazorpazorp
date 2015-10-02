var UserModel = Backbone.Model.extend({
	defaults: {
		username:''
	}
});

var TaskModel = Backbone.Model.extend({
	defaults: {
	},
});

var allModels = {};

var UserCollection = Backbone.Collection.extend({
	model:UserModel,
	url: '/users',
  	activeUser:null,
  	initialize: function() {
  		var self = this;
  	}
});

var TaskCollection = Backbone.Collection.extend({
	model:TaskModel,
	initialize: function (type) {
		this.reSet(type);
	},
	reSet: function (type) {
		this.url = '/tasks/' + type
	}
})
