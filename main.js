var app = {};

$(function() { //when DOM is ready...
  app.currentUser = "";
  app.users = new UserCollection([{
    username: 'Kathleen'
  },
  {
    username: 'Erik'
  },
  {
    username: 'RZA'
  },
  {
    username: 'Pilar'
  }]);

  app.tasks = new TaskCollection();

  app.gui = new GUI(app.users, app.tasks, '#app'); // selector of main div
});
