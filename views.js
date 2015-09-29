var GUI = (function() { //IIFE for all Views
  /**
   This view displays a single task, showing its title, description, status, creator, and assignee (if any). Each TaskView should include one or more controls (e.g. a select or set of buttons) to change its state.

   Each task view will be associated with exactly one task model, although a model may have more than one view instance.
   */
  var TaskView = Backbone.View.extend({
    initialize: function(opts) {
      _.extend(this, opts);
      this.listenTo(this.model, 'change', this.updateTask);
      this.listenTo(this.model, 'change', this.updateTask);
      this.listenTo(this.model, 'save', this.updateTask);
      this.render();
    },
    render: function() {
      var status = this.model.get('status');
      var assignee = this.model.get('assignee');
      assignee = assignee === "" ? "unassigned" : assignee;
      this.$el.html(""); // reset the $el's <div> contents to nothing so that further `render()` calls don't just keep appended to the old stuff
      this.$el.append($("<h1>").html(this.model.get('title')));
      this.$el.append($("<h2>").html(this.model.get('description')));
      this.$el.append($("<p class='creator'>").html("CREATED BY: " + this.model.get('creator')));
      this.$el.append($("<p class='assignee'>").html("ASSIGNED TO: " + assignee));
      if (status === "unassigned") {
        this.$el.append($("<button class='claim'>").html("CLAIM"));
      } else if (assignee === app.currentUser.get("username") && status !== "completed") {
        this.$el.append($("<button class='quit'>").html("QUIT"));
        this.$el.append($("<button class='done'>").html("DONE"));
      } else if (status === "completed") {
        var date = new Date(this.model.get('completedOn'));
        this.$el.append($("<p class='completed-date'>").html(date));
      }
      this.$el.addClass("task-view");
    },
    updateTask: function(e) {
      // TODO: this currently is not really used because the entire TaskCollectionView will update if ANY TaskModel changes
      console.log("updateTask() called with e:");
      console.log(e);
      this.render();
    },
    events: {
      "click button.quit": "quitTask",
      "click button.done": "completeTask",
      "click button.claim": "claimTask"
    },
    quitTask: function(e) {
      this.model.save({"assignee": "", "status": "unassigned"});
      this.remove();
    },
    completeTask: function(e) {
      this.model.save({"status": "completed", "completedOn": new Date().getTime()});
      console.log("completeTask");
      this.remove();
    },
    claimTask: function(e) {
      this.model.save({"assignee": app.currentUser.get("username"), "status": "in progress"});
      this.remove();
    }
  });

  /**
   You'll need a view with input fields for the user to fill in when creating a new task. It should probably have both a create and cancel button. The location and format of the view is up to you.
   */
  var CreateTaskView = Backbone.View.extend({
    initialize: function(opts) {
      _.extend(this, opts);
      console.log(this)
    },
    render: function() {
      var $form = $('<form id="form">');
      $form.append($('<input type="text" name="title" placeholder="Enter Task Title">'));
      $form.append($('<input type="type" name="description" placeholder="Enter Task Description">'));
      $form.append($('<input type="submit" name="submit" value="Submit">'));
      $form.append($('<button id="cancel">').html('Cancel'));
      this.$el.append($form)
    },
    events: {
      "submit #form": "submitForm",
      "click #cancel": function(e){e.preventDefault(); this.remove()}
    },
    submitForm: function(e) {
      e.preventDefault();
      var newTitle = $(e.target).children("input[name='title']").val();
      var newDescription = $(e.target).children("input[name='description']").val();
      // console.log(newTitle)
      // console.log(newDescription)
      app.tasks.create({
        'createdOn': new Date().getTime(),
        'title': newTitle,
        'description': newDescription,
        'creator' : app.currentUser.get('username')
      })
      // this.homePage.tasks.add(this.model)
      this.remove();
    }
  });

  var TaskCollectionView = Backbone.View.extend({
    initialize: function(opts) {
      _.extend(this, opts);
      this.listenTo(this.collection, 'add', this.addTask);
      this.listenTo(this.collection, 'change', this.updateTask);
      //this.listenTo(this.collection, 'remove', this.removeTask);
      //this.listenTo(this.collection, 'sync', this.updateView);
      this.render();
    },
    addTask: function(e) {
      // this.filterCollection();
      this.updateTaskView(e);
    },
    updateTask: function(e) {
      this.updateTaskView(e);
    },
    // removeTask: function(e) {
    //   this.render();
    // },
    // updateView: function(e) {
    //   this.render();
    // },
    // filterCollection: function() {
    //   if (this.kind === "unassigned") {
    //     this.relevantTasks = this.collection.filter(function(task){
    //       return task.get('status') === "unassigned"
    //     })
    //   } else if (this.kind === "user"){
    //     var assigned = this.collection.filter(function(task){
    //       return task.get('status') === "in progress" && task.get('assignee') === app.currentUser.get("username");
    //     })
    //     var created = this.collection.filter(function(task){
    //       return task.get('creator') === app.currentUser.get("username") && task.get('status') !== "completed";
    //     })
    //     this.relevantTasks = _.union(assigned, created);
    //   } else {
    //     this.relevantTasks = this.collection.where({
    //       status: "completed"
    //     });
    //   }
    // },
    // makeTaskView: function () {

    // },
    // removeTaskView: function () {

    // },
    updateTaskView : function (e) {
      this.render();
    },
    render: function() {

      var title;
      if (this.kind === "unassigned") {
        title =  "Unassigned Tasks";
      } if(this.kind === 'user'){
        title = app.currentUser.get("username") + "'s Tasks";
      } if(this.kind === 'completed') {
        title = "Completed Tasks";
      }
      this.$el.html(""); // reset the $el's <div> contents to nothing so that further `render()` calls don't just keep appended to the old stuff
      this.$el.append($("<h1>").html(title));
      var self = this;
      this.collection.forEach(function(task) {
        var taskView = new TaskView({
          model: task
        });
        self.$el.append(taskView.$el);
      });

      this.$el.addClass('task-collection');
      this.$el.addClass(this.kind);
    }
  });

  // would have two TaskCollectionViews (for unassigned tasks and the current user's tasks)
  // would also the name of the current user, a logout button, and a Create Task button
  var HomePageView = Backbone.View.extend({
    user: null,
    userTasks: null,
    initialize: function(opts) {
      _.extend(this, opts);
      this.render();
      $("#app").html(this.$el);
      console.log(this.userTasks);
    },
    render: function() {
      this.$el.append($("<h1>").html("Hello " + this.user.get("username")));
      this.$el.append($("<button id='logout'>").html("Log Out"));
      this.$el.append($("<button id='add-task'>").html("Add Task"));
      this.$el.append($("<div id='task-form'>"));
      var $taskViews = $("<div id='taskViews'>");

      var unassignedTasks = new TaskCollectionView({
        collection: this.unassignedTasks,
        kind: "unassigned"
      });
      var userTasks = new TaskCollectionView({
        collection: this.userTasks,
        kind: "user"
      });
      var completedTasks = new TaskCollectionView({
        collection: this.completedTasks,
        kind: "completed"
      });
      $taskViews.append(unassignedTasks.$el);
      $taskViews.append(userTasks.$el);
      $taskViews.append(completedTasks.$el);
      this.$el.append($taskViews);
    },
    events: {
      "click button#logout": "logout",
      "click button#add-task": "showNewTaskView"
    },
    logout: function(e) {
      var loginView = new LoginView({
        collection: app.gui.users,
        unassignedTasks: new TaskCollection({id: "unassigned"}),
        completedTasks: new TaskCollection({id: "completed"})
      });
      this.remove();
    },
    showNewTaskView: function(e) {
      // TODO: this method will create a CreateTaskView, not immediately create a task
      // var newTask = new TaskModel({
      //   creator: this.user.get('username')
      // });
      var createTaskView = new CreateTaskView();
      // createTaskView.render()
      // $("#task-form").append(createTaskView.$el)
      createTaskView.render();
    $("#task-form").append(createTaskView.$el)
    }
  });

  // a list of known users to choose from
  var LoginView = Backbone.View.extend({
    initialize: function(opts) {
      _.extend(this, opts)
      this.render();
      $("#app").append(this.$el);
      this.listenTo(app.users, "update", this.render)
      console.log(this.unassignedTasks);
      console.log(this.completedTasks);
    },
    events: {
      "click button#login": "login",
      "click #newName"  : "addNewUser"
    },
    login: function(e) {
      e.preventDefault();
      var id = $("select#usernames").val();
      var selectedUser = this.collection.get(id);
      app.currentUser = selectedUser;
      console.log("app.currentUser", app.currentUser);
      var homePageView = new HomePageView({
        user: selectedUser,
        userTasks : new TaskCollection({ id : app.currentUser.get("username") }),
        unassignedTasks: this.unassignedTasks,
        completedTasks: this.completedTasks
      })

      this.remove();
    },
    addNewUser: function(){
      var newUser = $("#userField").val();
      app.users.create({username: newUser});
      console.log(app.users)
      this.render();
    },
    render: function() {
      var users = this.collection.models;
      var output = "<h1>Welcome!</h1><form><select id='usernames' placeholder='CHOOSE USER'><option></option>"
      users.forEach(function(user) {
        output += "<option value='" + user.cid + "'>" + user.get("username") + "</option>"
      })
      output += "</select><button type='submit' name='submit' id='login'>LOG IN</button></form>"
      var usrBtn = '<button id="newName">Add User</button>';
      var input = '<br><input type="text" id="userField" placeholder="Add New User Name">';
      this.$el.html(output + input + usrBtn);
    }
  });
  // generic ctor to represent interface:
  function GUI(users, tasks, el) {
    this.id = null;
    this.users = users; // a UsersCollection
    this.tasks = tasks; // an IssuesCollection
    var loginView = new LoginView({
      collection: this.users,
      unassignedTasks: new TaskCollection({id: "unassigned"}),
      completedTasks: new TaskCollection({id: "completed"})
    })
  }

  return GUI;
} ())
