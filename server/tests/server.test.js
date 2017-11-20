const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = 'pass1234';

        request(app)
            .post('/users')
            .send({ email , password })
            .expect(200)
            .expect((res) => {
                expect(res.headers).toHaveProperty('x-auth');
                expect(res.body).toHaveProperty('_id');
                expect(res.body.email).toBe(email);                
            })
            .end((err) => {
                if(err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {                    
                    expect(user.password).not.toBe(password);
                    done();
                });
            });
    });

    it('should return  validation errors if request invalid', (done) => {
        var email = 'abc@example';
        var password = 'pass';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });

    it('should not create users if email is already used', (done) => {
        var email = 'abc@example.com';
        var password = 'pass1234';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});

