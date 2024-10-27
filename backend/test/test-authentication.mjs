import { use, expect } from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/server.mjs';

const chai = use(chaiHttp);

describe('Authentication', function() {

    describe('addUser', function () {
        it('should register a new user', function (done) {
            const email = `${Math.random().toString(36).substring(7)}@disney.com`;
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
                    if (err) {
                        console.error(err);
                    }
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('data');
                    expect(res.body.data).to.have.property('addUser');
                    expect(res.body.data.addUser).to.have.property('email', email);
                    done();
                });
        });
    });
});