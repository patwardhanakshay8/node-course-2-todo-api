var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res) => {
    var todo = new Todo({
        text : req.body.text
    });
    todo.save().then((result) => {
        res.send(result);    
    },(error) => {
        res.status(400);
        res.send(error);
    });
});

app.get('/todos',(req,res) => {
    Todo.find().then((result,error) => {
        res.send({result});
    },(error) => {
        res.status(400);
        res.send(error);
    })
});

app.listen(3000, () => {
    console.log('Started on 3000');
});


module.exports = { app };