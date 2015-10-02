var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var config = require('./config.js');
var db = require('orchestrate')(config.dbkey);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

app.get('/tasks/:id', function(req, res){
	db.search('tasks', req.params.id)
	.then(function(result){
		var data = (result.body.results);
		var allData = data.map(function(element, index, array) {
			return({
				title: element.value.title,
				description: element.value.description,
				creator: element.value.creator,
				assignee: element.value.assignee,
				status: element.value.status
			});
		});
		res.send(allData);
	})
	.fail(function(err){
		console.log(err);
	});
});

// app.post('/tasks', function (req, res) {
// 	console.log('post no id')
// 	db.search('tasks')
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
// 		});
// 		res.send(allData);
// 	})
// 	.fail(function(err) {
// 		console.log(err);
// 	});
// });

app.post('/tasks/:id', function(req, res){
	console.log('post no id');
	console.log(req.body)
	var task = req.body
	task.id = Date()

	db.put('tasks', task.id, task)
		console.log(task)
		.then(function(result){
			res.send(task)
		})
		.fail(function(err){
			console.log('error')
		})
})

app.put('/tasks', function (req, res) {
	db.put('tasks', '2', {"assignee": app.currentUser.get("username"), "status": "in progress"})
		.then(function(result) {
			console.log('it worked!')
		})
		.fail(function(err) {
			console.log('ERROR')
		})
});

// app.post('/tasks/:id', function (req, res) {
// 	console.log('post with id')
// 	console.log(req.params.id)
// 	console.log(req.params)
// 	console.log(req.body)
// 	db.put('tasks', req.params.id)
// 		.then(function (result) {
// 			console.log(result.request.body)
// 		})
// 		.fail(function (result) {
// 			console.log('err')
// 		})
// });

app.get('/users', function (req, res) {
	db.list('users')
    	.then(function (result) {
    		var data = (result.body.results);
    		var allData = data.map(function(element, index, array) {
    			return({id: element.value.username, username: element.value.username});
    		})
    		res.send(allData)
    	})
    	.fail(function(err) {
    		console.log(err)
    	})
});

app.post('/users', function (req, res) {
	console.log(req.body)
	db.post('users', req.body)
		.then(function (result) {
			res.end();
		})
		.fail(function (err) {
			console.log(err)
		})
});

app.listen(3000);
