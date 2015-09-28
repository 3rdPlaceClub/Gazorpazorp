var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var fs = require('fs');
var path = require('path');
var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var tasks = [];

// allow tests data...
var testValues = [	{
    title: 'finish project',
    description: "let's figure out backbone goddammit",
    creator: 'mitch',
    assignee: '',
    status: 'Unassigned'
  },
  {
    title: 'eat a snack',
    description: "healthy one",
    creator: 'do',
    assignee: 'do',
    status: 'New'
  },
  {
    title: 'Newest Task',
    description: "healthy one",
    creator: '',
    assignee: '',
    status: 'Unassigned'
  }

];

var users = [
  {username:'do'},
  {username:'jesse'},
  {username:'mitch'}
];

var useTestValues = process.argv[2];// a number, optional extra argument when starting server
if (useTestValues)
	tasks = testValues.slice(0,useTestValues);

function showData() {
  console.log('Data store is now: ', tasks);
}

app.get('/users/:id', function (req, res) {
  var id = req.params.id;
  console.log('Sending users #%s...',id);
  res.send(users[id]);
});

app.put('/users/:id', function (req, res) {
  var id = req.params.id;
  console.log('Receiving users #%s...',id);
  var a = req.body;
  users[id] = {username: a.username};
  showData();
  res.send({});
});

app.get('/users', function (req, res) {
	console.log('Sending all users...');
	showData();
	var usersAndIDs = users.map(function (v, i) {
		return {id : i, username: v.username};
	});
  console.log(usersAndIDs);
	res.send(usersAndIDs);
});

app.post('/users', function (req, res) {
	console.log('Receiving new users...');
	var newid = users.length;
	console.log('Assigning id of %s',newid);
  var a = req.body;
	users[newid] =  {username: a.username};
	showData();
	res.send({id:newid});
});

app.get('/tasks/:id', function (req, res) {
  var id = req.params.id;
  console.log('Sending tasks #%s...',id);
  res.send(tasks[id]);
});

app.put('/tasks/:id', function (req, res) {
  var id = req.params.id;
  console.log('Receiving tasks #%s...',id);
  var a = req.body;
  tasks[id] = {
    title: a.title,
    description: a.description,
    creator: a.creator,
    assignee: a.assignee,
    status: a.status
  };
  showData();
  res.send({});
});

app.get('/tasks', function (req, res) {
	console.log('Sending all tasks...');
	showData();
	var tasksAndIDs = tasks.map(function (v, i) {
		return {id : i,
      title: v.title,
      description: v.description,
      creator: v.creator,
      assignee: v.assignee,
      status: v.status
    };
	});
	res.send(tasksAndIDs);
});

app.post('/tasks', function (req, res) {
	console.log('Receiving new tasks...');
	var newid = tasks.length;
	console.log('Assigning id of %s',newid);
  var a = req.body;
	tasks[newid] =  {
    title: a.title,
    description: a.description,
    creator: a.creator,
    assignee: a.assignee,
    status: a.status
  };
	showData();
	res.send({id:newid});
});

// app.get('/tasks', function (req, res) {
//   console.log('getting tasks');
//   // res.send(JSON.stringify({value : tasks[id]}));
//   res.send(req.body);
//   console.log(req.body);
// });




// app.get('/login/1', function (req, res) {
//   console.log('Logging in route');
//   // res.sendFile(path.join(__dirname, '/public/login'));
//   res.send(JSON.stringify({value: tasks}));
// });
//
// app.put('/login/1', function (req, res) {
//     console.log(req.body);
//     //  = req.body.value;
//     // res.end();
//     res.send({id : "1"});
// });

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
