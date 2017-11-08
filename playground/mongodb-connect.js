// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
    if(err) {
        return console.log('Unable to connect to mongodb server.');
    }
    console.log('Connected to MongoDB server');
    // db.collection('Todos').insertOne({
    //     text : 'Something else to do',
    //     completed : 'Nahh'
    // },(err,result) => {
    //     if(err) {
    //         return console.log('Unable to insert to do.', err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });
    // db.collection('Users').insertOne({
    //     name : 'Akshay',
    //     age : 23,
    //     location : 'Mumbai'
    // },(err,result) => {
    //     if(err) {
    //         return console.log('Unable to insert user',err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
    // });
    db.close();
});