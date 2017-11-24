require('./config/config');

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

app.post('/todos',authenticate,(req,res) => {
    var todo = new Todo({
        text : req.body.text,
        _creator : req.user._id
    });
    todo.save().then((result) => {
        res.send(result);    
    },(error) => {
        res.status(400);
        res.send(error);
    });
});

app.get('/todos',authenticate, (req,res) => {
    Todo.find({
        _creator : req.user._id 
    }).then((result,error) => {
        res.send({result});
    },(error) => {
        res.status(400);
        res.send(error);
    })
});

app.get('/todos/:id',authenticate, (req,res) => {    
    if(ObjectID.isValid(req.params.id)) {    
        Todo.findOne({
            _id : req.params.id,
            _creator : req.user._id
        }).then((result) => {                
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

app.delete('/todos/:id',authenticate, (req,res) => {
    if(ObjectID.isValid(req.params.id)) {
        Todo.findOneAndRemove({
            _id : req.params.id,
            _creator : req.user._id
        }).then((result) => {
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

app.patch('/todos/:id',authenticate, (req, res) => {
    if(ObjectID.isValid(req.params.id)) {
        var body = _.pick(req.body,['text','completed']);

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();            
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findOneAndUpdate({ _id : req.params.id, _creator : req.user._id }, {$set : body}, { new : true })
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

app.post('/users/login', (req,res) => {
    var user = _.pick(req.body,['email','password']);    
    
    User.findByCredentials(user.email,user.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth',token);
            res.send(user);
        });
    }).catch((e) => {
        res.status(400);
        res.send();
    });
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200);
        res.send();
    },() => {
        res.status(400);
        res.send();
    });
});

app.listen(port, () => {
    console.log(`Started on ${ port }`);
});


module.exports = { app };