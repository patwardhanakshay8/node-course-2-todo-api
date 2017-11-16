const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
    {
        text : 'first test todo'
    },
    {
        text : 'Second test'
    }
];

// beforeEach((done) => {    
//     Todo.remove({}).then(() => {
//         return Todo.insertMany(todos)
//     }).then(() => done());
// });

// describe('POST /todos', () => {
//     it('should create a new todo',(done) => {
//         var text = 'Test todo text';

//         request(app)
//             .post('/todos')
//             .send({ text })
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.text).toBe(text);
//             })
//             .end((err,res) => {
//                 if(err) {
//                     return done(err);
//                 }
//                 Todo.find().then((todos) => {
//                     expect(todos.length).toBe(3);
//                     // expect(todos[0].text).toBe(text);
//                     done();
//                 }).catch((error) => done(error));
//             });
//     });

//     it('should not create a new todo with invalid body data',(done) => {

//         request(app)
//             .post('/todos')
//             .send({})
//             .expect(400)
//             .end((err,res) => {
//                 if(err) {
//                     return done(err);
//                 }
//                 Todo.find().then((todos) => {
//                     expect(todos.length).toBe(2);
//                     done();
//                 }).catch((error) => done(error));
//             });
//     });
// });

// describe('GET /todos', () => {
//     it('should get all todos',(done) => {
//         request(app)
//             .get('/todos')
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.result.length).toBe(2);
//             })
//             .end(done);
//     })
// });

describe('GET /todos/:id' , () => {
    it('should get the todo by id', (done) => {
        request(app)
            .get('/todos/5a0d31aab33993095c8c1688')
            .expect(200)
            .expect((res) => {
                expect(res.body.result).toBe(Object);
            })
            .end(done);
    });
});