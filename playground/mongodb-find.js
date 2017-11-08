// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
    if(err) {
        return console.log('Unable to connect to mongodb server.');
    }
    console.log('Connected to MongoDB server');
    
    // db.collection('Todos').find({ _id : new ObjectID('5a02b1ebdba81f6076713ae2')  }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err) => {
    //     console.log('Unbale to fetch todos');
    // });

    db.collection('Users').find({ "name" : {$regex : /^Aks/i } }).count().then((count) => {
        console.log('Todos',count);        
    },(err) => {
        console.log('Unbale to fetch todos');
    });

    // db.close();
});