var UserModel = Backbone.Model.extend({
	defaults: {
		username:''
	}
});

var TaskModel = Backbone.Model.extend({
	defaults: {
		// title:'New Task',
		// description:'task details...',
		// creator:'',
		// assignee:'',
		// status:'unassigned',
	},
    // createdOn:new Date().getTime(),
    // completedOn:new Date().getTime(),

});

var allModels = {};

var SharedTaskModel = function(attrs) {
	if (('id' in attrs) && allModels[attrs.id]) {
		//already got one, reuse it:
		return allModels[attrs.id];
	} else { // don't have one, make it:
		var model = new TaskModel(attrs);
		if ('id' in attrs)
			allModels[attrs.id] = model;
		return model;
	}
};

var UserCollection = Backbone.Collection.extend({
	model:UserModel,
	url: '/users',
  	activeUser:null,
  	initialize: function() {
  		var self = this;
  		this.fetch();
  	}
});

var TaskCollection = Backbone.Collection.extend({
	model:TaskModel,

	// url : '/tasks/:' + id,
		initialize: function (opts) {
			_.extend(this, opts);

		console.log("this.id", this.id)
		this.url = '/tasks/' + this.id,
		this.fetch()
	}
})
