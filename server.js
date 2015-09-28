var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var db = 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname));

var users = [];
var tasks = [];

var currentUser = '';

app.put('/tasks/:id', function (req, res) {
	console.log('put id')
	var id = req.params.id;
	tasks[id] = req.body;
	console.log(id)
	console.log(tasks)
	res.send({})
});

app.get('/tasks', function (req, res) {
    res.send(tasks);
});

app.post('/tasks', function (req, res) {
	console.log('post no id')
	var newId = tasks.length;
	tasks[newId] = req.body;
	console.log(tasks)
	res.send({id: newId})
})

app.listen(3000);