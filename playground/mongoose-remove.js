const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

Todo.findByIdAndRemove('5a0d6af6b43f490dfbbf0324').then((result) => {
    console.log(result);
},(error) => {
    console.log(error);
})