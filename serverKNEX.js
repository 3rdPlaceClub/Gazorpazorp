var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

app.get('/users', function (req, res) {
	knex('task_user').select('*')
		.then(function(result) {
			res.send(result)
		})
});

app.post('/users', function (req, res) {
	knex('task_user').insert({username: req.body.username})
		.then(function(result) {
			res.send(result)
		})
});

app.put('/tasks/:type/:id', function (req, res) {
	knex('task').where('id', '=', req.params.id).update({assignee : req.body.assignee, status : req.body.status})
		.then(function(){
		})
		res.send({})
	});


app.post('/tasks/:type', function (req, res) {
	knex('task').insert([{title : req.body.title,
						description : req.body.description,
						creator : req.body.creator,
						assignee : req.body.assignee,
						status : req.body.status}]).returning("id")
	.then(function(result) {
		res.send({id : result[0]})
	})
});

app.get('/tasks/:type', function (req, res) {
	if (req.params.type === 'unassigned') {
		knex('task').select('*').where('status', 'unassigned')
			.then(function(result) {
				res.send(result)
			})
	} else if (req.params.type === 'completed') {
		knex('task').select('*').where('status','completed')
			.then(function(result) {
				res.send(result)
			})
	} else {
		knex('task').where('assignee', req.params.type).orWhere('creator', req.params.type)
			.then(function(result) {
				res.send(result)
			})	
	}
	
});

app.listen(3000);