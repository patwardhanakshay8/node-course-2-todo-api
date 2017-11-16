var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');


var app = express();

const port = process.env.PORT || 3000;

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

app.get('/todos/:id',(req,res) => {    
    if(ObjectID.isValid(req.params.id)) {    
        Todo.findById(req.params.id).then((result) => {                
            if(!result) {
                res.status(400);
                res.send('Todo not found.');
            }
            else {
                res.status(200);
                res.send({result});
            }
        },(error) => {
            res.status(500);
            res.send(error);
        })
    }
    else {
        res.status(500);
        res.send('ID is not valid');
    }
});

app.delete('/todos/:id',(req,res) => {
    if(ObjectID.isValid(req.params.id)) {
        Todo.findByIdAndRemove(req.params.id).then((result) => {
            if(!result) {
                res.status(400);
                res.send('Todo not found.');
            }
            else{
                res.status(200);
                res.send({ result });
            }
        },(error) => {
            res.status(500);
            res.send('ID is not valid');
        })
    }
    else {
        res.status(500);
        res.send('ID is not valid');
    }
})

app.listen(port, () => {
    console.log(`Started on ${ port }`);
});


module.exports = { app };