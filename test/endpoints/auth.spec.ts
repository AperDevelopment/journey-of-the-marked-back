import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import testApp from './app';
import DatabaseService from '../../src/services/databaseService';

describe('Register', () => {
    const databaseService = sinon.createStubInstance(DatabaseService);
    const app = testApp(databaseService);
    let user : any;
    let collection: any;

    beforeEach(() => {
        collection = {};
        databaseService.getCollection.returns(collection);
        user = {
            name: 'testuser',
            email: 'testemail',
            password: 'testpassword',
        };     
    });

    it('should register a new user', async () => {

        collection.insertOne = sinon.stub().returns({ acknowledged: true });
        collection.findOne = sinon.stub().returns(undefined);

        const response = await request(app)
            .post('/auth/register')
            .send(user);

        expect(response.status).to.be.equal(201);
    });

    it('should not register a user with missing fields', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                name: 'testuser',
                email: 'testemail',
            });

        expect(response.status).to.be.equal(400);
    });

    it('should not register a user with an existing name', async () => {
        collection.insertOne = sinon.stub().returns({ acknowledged: true });
        collection.findOne = sinon.stub().returns(user);
        
        const response = await request(app)
            .post('/auth/register')
            .send(user);

        expect(response.status).to.be.equal(409);
    });

    it('should not register a user if the database operation fails', async () => {
        collection.insertOne = sinon.stub().returns({ acknowledged: false });
        collection.findOne = sinon.stub().returns(undefined);

        const response = await request(app)
            .post('/auth/register')
            .send(user);

        expect(response.status).to.be.equal(500);
    });

    it('should not register a user if the user object has invalid field', async () => {
        user.name = 10;
        const response = await request(app)
            .post('/auth/register')
            .send(user);

        expect(response.status).to.be.equal(400);
    });
});