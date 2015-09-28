var LoginView = Backbone.View.extend({
	render : function (){
		console.log("render login");
		var login = '<button id="login" type="submit">Login</button>';
		var usrBtn = '<button id="newName">Add Name</button>';
		var input = '<br><input type="text" id="userField" placeholder="Add New User Name">';
		var headline = '<h1 class="main-heading">To Do List</h1>';
		var headline2 = '<h2>Please log in.</h2>';
		var nametag = "<p class='nametag'>name:</p>";
		var selector = this.userSelector();
		this.$el.html("<br><div id='login-area'>" + headline + headline2 + nametag + selector + login + input + usrBtn + "</div>");
		// this.el.append(this.$el);
	},
    userSelector: function(){
		var users = [];
		content = "";

		for (var i = 0;i < app.users.length; i++){
			users.push(app.users.models[i].attributes.username);
			content+=("<option>"+users[i]+"</option>");

      	}
		content = "<select id='selectDropdown'>"+content+"</select>";
		return content;
	},

	addNewUser: function(){
		var newUser = $("#userField").val();
		app.users.add({username: newUser});
		this.render();
	},

	events: {
		"click #login" 		: "userLogin",
		"click #newName"	: "addNewUser"
	},


	userLogin : function(){
		$("#login-area").hide();
		var selectedUser = $("#selectDropdown").val();
		var userModel = app.users.where({username: selectedUser})[0];
		 console.log(userModel);
		userView = new UserView({model: userModel, collection: taskCollection});
		userView.render();
		//this.model.get(username)
		}

 });