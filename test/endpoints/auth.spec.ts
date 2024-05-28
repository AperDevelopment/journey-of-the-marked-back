import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import testApp from './app';
import DatabaseService from '../../src/services/databaseService';

describe('Auth : Register', () => {
    const databaseService = sinon.createStubInstance(DatabaseService);
    const app = testApp(databaseService);
    let user : any;
    let requestUser : any;
    let collection: any;

    beforeEach(() => {
        collection = {};
        databaseService.getCollection.returns(collection);
        user = {
            name: 'testuser',
            email: 'testemail',
            password: 'testpassword',
            role: 'user',
        };
        requestUser = {
            name: user.name,
            email: user.email,
            password: user.password,
        };
    });

    it('should register a new user', async () => {

        collection.insertOne = sinon.stub().returns({ acknowledged: true });
        collection.findOne = sinon.stub().returns(undefined);

        const response = await request(app)
            .post('/auth/register')
            .send(requestUser);

        expect(response.status).to.be.equal(201);
    });

    it('should not register a user with missing fields', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                name: user.name,
                email: user.email,
            });

        expect(response.status).to.be.equal(400);
    });

    it('should not register a user with an existing name', async () => {
        collection.insertOne = sinon.stub().returns({ acknowledged: true });
        collection.findOne = sinon.stub().returns(user);
        
        const response = await request(app)
            .post('/auth/register')
            .send(requestUser);

        expect(response.status).to.be.equal(409);
    });

    it('should not register a user if the database operation fails', async () => {
        collection.insertOne = sinon.stub().returns({ acknowledged: false });
        collection.findOne = sinon.stub().returns(undefined);

        const response = await request(app)
            .post('/auth/register')
            .send(requestUser);

        expect(response.status).to.be.equal(500);
    });

    it('should not register a user if the user object has invalid field', async () => {
        requestUser.name = 10;
        const response = await request(app)
            .post('/auth/register')
            .send(requestUser);

        expect(response.status).to.be.equal(400);
    });
});

describe('Auth : Login', () => {
    const databaseService = sinon.createStubInstance(DatabaseService);
    const app = testApp(databaseService);
    let user : any;
    let requestUser : any;
    let collection: any;

    beforeEach(() => {
        collection = {};
        databaseService.getCollection.returns(collection);
        user = {
            name: 'testuser',
            email: 'testemail',
            password: 'testpassword',
            role: 'user',
        };
        requestUser = {
            name: user.name,
            password: user.password,
        };
    });

    it('should login an existing user', async () => {
        collection.findOne = sinon.stub().returns(user);

        const response = await request(app)
            .post('/auth/login')
            .send(requestUser);

        expect(response.status).to.be.equal(200);
    });

    it('should not login a user with missing fields', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                name: user.name,
            });

        expect(response.status).to.be.equal(400);
    });

    it('should not login a user with an invalid password', async () => {
        collection.findOne = sinon.stub().returns(user);

        const response = await request(app)
            .post('/auth/login')
            .send({
                name: user.name,
                password: 'wrongpassword',
            });

        expect(response.status).to.be.equal(401);
    });

    it('should not login a user that does not exist', async () => {
        collection.findOne = sinon.stub().returns(undefined);

        const response = await request(app)
            .post('/auth/login')
            .send(requestUser);

        expect(response.status).to.be.equal(404);
    });

    it('should not login a user if the user object has invalid field', async () => {
        requestUser.name = 10;
        const response = await request(app)
            .post('/auth/login')
            .send(requestUser);

        expect(response.status).to.be.equal(400);
    });
});