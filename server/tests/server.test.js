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
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.length).toBe(1);
            })
            .end(done);
    })
});

describe('GET /todos/:id' , () => {    
    it('should get the todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {                
                expect(res.body.result.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .get('/todos/1234')
            .set('x-auth',users[0].tokens[0].token)
            .expect(500)
            .end(done);
    });

    it('should not return todo doc created by other user', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
});


describe('DELETE /todos/:id', () => {
    it('should delete the todo by id',(done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.result.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .delete('/todos/1234f')
            .set('x-auth',users[0].tokens[0].token)
            .expect(500)
            .end(done);
    });

    it('should not delete todo doc created by other user', (done) => {
        request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
});


describe('UPDATE /todos/:id', (done) => {
    it('should update the todo by id', (done) => {
        request(app)
            .patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({ completed : !todos[0].completed })
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {                
                expect(res.body.result.completed).toBe(!todos[0].completed);
            })            
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .patch(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth',users[1].tokens[0].token)
            .expect(400)
            .end(done);
    });

    it('should return 400 if todo is not found',(done) => {
        request(app)
            .patch('/todos/1234f')
            .set('x-auth',users[1].tokens[0].token)
            .expect(500)
            .end(done);
    });

    it('should not update the todo created by other user', (done) => {
        request(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({ completed : !todos[1].completed })
            .set('x-auth',users[0].tokens[0].token)
            .expect(401)            
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
                }).catch((e) => done(e));
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


describe('POST /users/login', () => {
    // it('should login user and return auth token', (done) => {
    //     request(app)
    //         .post('/users/login')
    //         .send({
    //             email : users[1].email,
    //             password : users[1].password
    //         })
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.header).toHaveProperty('x-auth');                
    //         })
    //         .end((err,res) => {
    //             if(err) {
    //                 return done(err);
    //             }

    //             User.findById(users[1]._id).then((user) => {
    //                 expect(user.tokens).toInclude({
    //                     access : 'auth',
    //                     token : res.headers['x-auth']
    //                 });
    //                 done();
    //             }).catch((e) => done(e));
    //         });
    // });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email : users[1].email,
                password : users[1].password + '1'
            })
            .expect(400)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }
                
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should delete the token from the token array',(done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err,res) => {
                if(err) {
                    return done(err);
                }

                User.findByToken(users[0].token).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});

