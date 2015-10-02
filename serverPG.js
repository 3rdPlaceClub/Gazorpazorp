var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var config = require('./configPS.js');
var setting = config.elephant;
var pg = require('pg');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

app.get('/users', function (req, res) {
	pg.connect(setting, function(err, client, done) {
		if (err) {
			return console.error('error fetching client', err);
		}
		client.query('select * from task_user', function (err, result) {
			done();
			if (err) {
				return console.error('error running query', err)
			}
			console.log('%j', result.rows);
			res.send(result.rows);
		})
	})
});

app.post('/users', function (req, res) {
	pg.connect(setting, function(err, client, done) {
		if (err) {
			return console.error('error fetching client', err);
		}
		client.query('insert into task_user (username) values ($1::text)', [req.body.username], function (err, result) {
			done();
			if (err) {
				return console.error('error running query', err)
			}
			console.log('%j', result.rows);
			res.send({});
		})
	})
});

app.get('/tasks/:id', function (req, res) {
	pg.connect(setting, function(err, client, done) {
		if (err) {
			return console.error('error fetching client', err);
		}
		client.query('select * from task', function (err, result) {
			done();
			if(err) {
				return console.error('error running query', err)
			}
			console.log('%j', result.rows);
			console.log('tasks')
			res.send(result.rows)
		})
	})
});

app.listen(3000);
