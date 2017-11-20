require('./config');

const _ = require('lodash');

var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var { authenticate } = require('./middleware/authenticate');


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
});

app.patch('/todos/:id', (req, res) => {
    if(ObjectID.isValid(req.params.id)) {
        var body = _.pick(req.body,['text','completed']);

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();            
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(req.params.id, {$set : body}, { new : true })
            .then((result) => {
                if (!result) {
                    res.status(400);
                    res.send('To do not found.');                    
                }
                else {
                    res.status(200);
                    res.send({ result });
                }
            },(error) => {
                res.status(400);
                res.send(error);
            });

    }
    else {
        res.status(500);
        res.send('ID is not valid');
    }
});

app.post('/users/', (req,res) =>{
    var user = new User(_.pick(req.body,['email','password']));    
    user.save().then(() => {                        
        return user.generateAuthToken();
    }).then((token) => {        
        res.header('x-auth',token);
        res.send(user);
    }).catch((e) => {        
        res.status(400);
        res.send(e);
    })    
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Started on ${ port }`);
});


module.exports = { app };