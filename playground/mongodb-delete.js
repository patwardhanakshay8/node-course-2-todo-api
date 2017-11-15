// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db) => {
    if(err) {
        return console.log('Unable to connect to mongodb server.');
    }
    console.log('Connected to MongoDB server');
    // deleteMany
    // db.collection('Todos').deleteMany({ text : 'Eat Lunch'}).then((results) => {
    //     console.log(results);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({ text : 'Eat Dinner'}).then((results) => {
    //     console.log(results);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ completed : 'Nah'}).then((results) => {
    //     console.log(results);
    // });

    // db.collection('Users').deleteMany({ age : '23' }).then((results) => {
    //     console.log(results);
    // });

    db.collection('Users').findOneAndDelete({ _id : new ObjectID("5a02acde255b0407d093e2a2") }).then((results) => {
        console.log(results);
    });

    // db.close();
});