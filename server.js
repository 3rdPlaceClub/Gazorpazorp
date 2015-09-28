var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var config = require('./config.js')
var db = require('orchestrate')(config.dbkey)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

app.get('/tasks', function (req, res) {
	console.log('hi')
	db.list('tasks') 
	.then(function (result) {
		console.log('working?')
		var data = (result.body.results);
		console.log(data)
		var allData = data.map(function(element, index, array) {
			return({ 
				title: element.value.title,
				description: element.value.description,
				creator: element.value.creator,
				assignee: element.value.assignee,
				status: element.value.status
			});
		})
		res.send(allData)
	})
	.fail(function(err) {
		console.log(err)
	})
});

// app.put('/tasks/:id', function (req, res) {
// 	console.log('put id')
// 	var id = req.params.id;
// 	tasks[id] = req.body;
// 	console.log(id)
// 	console.log(tasks)
// 	res.send({})
// });

// app.post('/tasks', function (req, res) {
// 	db.list('tasks') 
// 	.then(function (result) {
// 		var data = (result.body.results);
// 		var allData = data.map(function(element, index, array) {
// 			return({id: element.path.key, 
// 				title: element.value.title,
// 				description: element.value.description,
// 				creator: element.value.creator,
// 				assignee: element.value.assignee,
// 				status: element.value.status
// 			});
// 		})
// 		res.send(allData)
// 	})
// 	.fail(function(err) {
// 		console.log(err)
// 	})
// 	// console.log('post no id')
// 	// var newId = tasks.length;
// 	// tasks[newId] = req.body;
// 	// console.log(tasks)
// 	// res.send({id: newId})
// });

// app.get('/users/:id', function (req, res) {
//   var id = req.params.id;
//   console.log('Sending users #%s...',id);
//   res.send(users[id]);
// });

// app.put('/users/:id', function (req, res) {
//   var id = req.params.id;
//   console.log('Receiving users #%s...',id);
//   var a = req.body;
//   users[id] = {username: a.username};
//   showData();
//   res.send({});
// });

app.get('/users', function (req, res) {
	db.list('users') 
    	.then(function (result) {
    		var data = (result.body.results);
    		var allData = data.map(function(element, index, array) {
    			return({id: element.path.key, username: element.value.username});
    		})
    		res.send(allData)
    	})
    	.fail(function(err) {
    		console.log(err)
    	})
});

app.post('/users', function (req, res) {
	console.log('post users')
	console.log(req.body)
	db.post('users', req.body)
		.then(function (result) {
			console.log('end')
			res.end();	
		})
		.fail(function (err) {
			console.log(err)
		})
});

app.listen(3000);