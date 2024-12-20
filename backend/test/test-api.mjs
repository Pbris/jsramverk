import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/server.mjs';
import jwt from 'jsonwebtoken';
import documents from '../docs.mjs';

const chai = use(chaiHttp);
const secret = process.env.TOKEN_SECRET || "NOT YET A SECRET";

let documentId;

before(async function () {
    const result = await documents.addOne({ title: 'Test Document', content: 'Test Content', isCode: false }, 'someOwnerId');
    documentId = result.insertedId;
});

describe('API Tests', function () {


    describe('GET /api/', function () {
        it('should return a list of all documents', function (done) {
            chai.request.execute(app)
                .get('/api/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    done();
                });
        });
    });
    describe('POST /api/add_new', function () {
        it('should add a new document', function (done) {
            const token = jwt.sign({ _id: "kalleanka", email: "kalle@disney", role: "user" }, secret, {
                expiresIn: "1h"
            });
            chai.request.execute(app)
                .post('/api/add_new')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Test', content: 'Test' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('insertedId');
                    done();
                });
        });
    });

    describe('GET /api/:id', function () {
        it('should return a single document', function (done) {
            chai.request.execute(app)
                .get(`/api/${documentId}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('_id', documentId.toString());
                    expect(res.body).to.have.property('title', 'Test Document');
                    expect(res.body).to.have.property('content', 'Test Content');
                    done();
                });
        });
    });


});

describe('Authentication', function() {

    describe('addUser', function () {
        const email = `${Math.random().toString(36).substring(7)}@disney.com`;
        it('should register a new user', function (done) {
            chai.request.execute(app)
                .post('/graphql')
                .send({
                    query: `
                        mutation {
                            addUser(email: "${email}", password: "kalleanka") {
                                email
                            }
                        }
                    `
                })
                .end((err, res) => {
                    console.log('Got response:', err ? 'ERROR' : 'SUCCESS');
                    if (err) {
                        console.error('Detailed error:', err);
                        return done(err);
                    }
                    try {
                        expect(res).to.have.status(200);
                        expect(res).to.be.json;
                        expect(res.body).to.have.property('data');
                        expect(res.body.data).to.have.property('addUser');
                        expect(res.body.data.addUser).to.have.property('email', email);
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
        it('should not register a user with an existing email', function (done) {
            chai.request.execute(app)
                .post('/graphql')
                .send({
                    query: `
                        mutation {
                            addUser(email: "${email}", password: "kalleanka") {
                                email
                            }
                        }
                    `
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors[0].message).to.equal('Cannot register user: Failed to register user');
                    done();
                });
        });
        it('should not be able to retrieve posts without a token', function (done) {
            const query = `{ document(id: "${documentId}") { title } }`;
            chai.request.execute(app)
                .post('/graphql')
                .send({
                    query: query
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('errors');
                    expect(res.body.errors[0].message).to.equal('Unauthorized');
                    done();
                });
        });
    });
});