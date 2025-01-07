const request = require('supertest');
const app = require('../app');
require('dotenv').config();

describe('SERVER TEST RUNING', () => {
    it('Success', done => {
        request(app)
            .get('/')
            .end((err, res) => {
                if (err) {
                    done(err);
                } else {
                    expect(res.status).toBe(200);
                    expect(res.body.app).toBe(`${process.env.APP_NAME} App `);
                    done();
                }
            });
    });
});
