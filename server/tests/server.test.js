const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
    {
        _id : new ObjectID(),
        text : 'first test todo',
        completed : false
    },
    {
        _id : new ObjectID(),
        text : 'Second test',
        completed : true
    }
];

beforeEach((done) => {    
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo',(done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    // expect(todos[0].text).toBe(text);
                    done();
                }).catch((error) => done(error));
            });
    });

    it('should not create a new todo with invalid body data',(done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((error) => done(error));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos',(done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.result.length).toBe(2);
            })
            .end(done);
    })
});

describe('GET /todos/:id' , () => {
    it('should get the todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(400)
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .get('/todos/1234')
            .expect(500)
            .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    it('should delete the todo by id',(done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(400)
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .delete('/todos/1234f')
            .expect(500)
            .end(done);
    });
});


describe('UPDATE /todos/:id', (done) => {
    it('should update the todo by id', (done) => {
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({ completed : !todos[0].completed })
            .expect(200)
            .expect((res) => {                
                expect(res.body.result.completed).toBe(!todos[0].completed);
            })            
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .patch(`/todos/${new ObjectID().toHexString()}`)
            .expect(400)
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .patch('/todos/1234f')
            .expect(500)
            .end(done);
    });
});

