var app = {};

$(function() { //when DOM is ready...
  app.currentUser = "";

  app.users = new UserCollection();
  app.userTasks = new TaskCollection(app.currentUser);
  app.unassignedTasks = new TaskCollection("unassigned");
  app.completedTasks = new TaskCollection("completed");
  // console.log(app.tasks)
  app.gui = new GUI(app.users, app.userTasks, app.unassignedTasks, app.completedTasks, '#app'); // selector of main div
});
