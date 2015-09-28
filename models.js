var UserModel = Backbone.Model.extend({
	defaults: {
		username:''
	}
})

var TaskModel = Backbone.Model.extend({
	defaults: {
		title:'New Task',
		description:'task details...',
		creator:'',
		assignee:'',
		status:'unassigned',
	},
    createdOn:new Date().getTime(),
    completedOn:new Date().getTime(),

})

var UserCollection = Backbone.Collection.extend({
	model:UserModel,
  activeUser:null
})

var TaskCollection = Backbone.Collection.extend({
	model:TaskModel,
	url: '/tasks',
	initialize: function () {
		this.fetch();
	}
})