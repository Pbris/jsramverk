import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/server.mjs';

const chai = use(chaiHttp);

describe('API Tests', function() {
    describe('GET /api/', function() {
        it('should return a list of all documents', function(done) {
            chai.request.execute(app) 
                .get('/api/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    done(); 
                });
        });
    });
    describe('POST /api/add_new', function() {
        it('should add a new document', function(done) {
            chai.request.execute(app)
                .post('/api/add_new')
                .send({ title: 'Test', content: 'Test' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    console.log(res.body.insertedId);
                    done();
                });
        });
    });

    describe('GET /api/:id', function() {
        // likely returning a false positive
        it('should return a single document', function(done) {
            chai.request.execute(app)
                .get('/api/1') // change to the id of the document added / do a before hook
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    done();
                });
        });
    });

});