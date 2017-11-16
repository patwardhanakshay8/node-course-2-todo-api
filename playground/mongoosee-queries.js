const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');
// var id = 'a0c2ce4f41b3b0fb882815d';

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }
// Todo.find({
//     _id : id
// }).then((result) => {
//     if(!result) {
//         console.log('Id not found.');
//     }
//     else {
//         console.log(result);
//     }    
// });

// Todo.findOne({
//     completed : true
// }).then((result) => {
//     console.log(result);
// });

// Todo.findById(id).then((result) => {
//     if(!result) {
//         console.log('Id not found.');
//     }
//     else {
//         console.log(result);
//     }
// }).catch((error) => console.log(error));

var user_id = '5a0c127b43129a09955d53d1';

User.findById(user_id).then((result) => {
    if(!result) {
        console.log('User id is not found.');
    }
    else {
        console.log(result);
    }
},(error) => {
    console.log(error);
});
