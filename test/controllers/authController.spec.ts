import { Request, Response } from 'express';
import { expect } from 'chai';
import sinon from 'sinon';
import AuthController from '../../src/controllers/authController';
import UserService from '../../src/services/userService';
import JwtService from '../../src/services/jwtService';
import { User } from '../../src/models/user';

describe('AuthController : Register', () => {
    let authController: AuthController;
    let userService: UserService;
    let jwtService: JwtService;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let user : User;
    let requestUser : any;

    beforeEach(() => {
        userService = sinon.createStubInstance(UserService);
        jwtService = sinon.createStubInstance(JwtService);

        authController = new AuthController(userService, jwtService);
        
        req = {} as Partial<Request>;
        res = {} as Partial<Response>;

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

    describe('register', () => {
        it('should register a new user', async () => {
            // Mock request and response objects
            req.body = requestUser;
            const stub = sinon.stub().returnsThis();
            res.status = stub;
            res.send = sinon.stub();

            // Stub the getUserByName method of the userService to return undefined
            userService.getUserByName = sinon.stub().returns(undefined);
            userService.createUser = sinon.stub().returns(true);

            // Call the register method
            await authController.register(req as Request, res as Response);

            // Assert that the response status is 201 and the user is registered
            expect(stub.calledWith(201)).to.be.ok;
        });

        it('should not register a user with missing fields', async () => {
            // Mock request and response objects
            req.body = {
                name: user.name,
                email: user.email,
            };
            const stub = sinon.stub().returnsThis();
            res.status = stub;
            res.send = sinon.stub();

            // Call the register method
            await authController.register(req as Request, res as Response);

            // Assert that the response status is 400
            expect(stub.calledWith(400)).to.be.ok;
        });

        it('should not register a user with an existing name', async () => {
            // Mock request and response objects
            req.body = requestUser;
            const stub = sinon.stub().returnsThis();
            res.status = stub;
            res.send = sinon.stub();

            // Stub the getUserByName method of the userService to return the user
            userService.getUserByName = sinon.stub().returns(user);

            // Call the register method
            await authController.register(req as Request, res as Response);

            // Assert that the response status is 409
            expect(stub.calledWith(409)).to.be.ok;
        });

        it('should not register a user if the database operation fails', async () => {
            // Mock request and response objects
            req.body = requestUser;
            const stub = sinon.stub().returnsThis();
            res.status = stub;
            res.send = sinon.stub();

            // Stub the getUserByName method of the userService to return undefined
            userService.getUserByName = sinon.stub().returns(undefined);
            userService.createUser = sinon.stub().returns(false);

            // Call the register method
            await authController.register(req as Request, res as Response);

            // Assert that the response status is 500
            expect(stub.calledWith(500)).to.be.ok;
        });

        it('should not register a user if the user object has invalid field', async () => {
            // Mock request and response objects
            requestUser.name = 10;
            req.body = requestUser;
            const stub = sinon.stub().returnsThis();
            res.status = stub;
            res.send = sinon.stub();

            // Call the register method
            await authController.register(req as Request, res as Response);

            // Assert that the response status is 400
            expect(stub.calledWith(400)).to.be.ok;
        });
    });
})

describe('AuthController : Login', () => {
    let authController: AuthController;
    let userService: UserService;
    let jwtService: JwtService;
    let req: Partial<Request>;
    let res: Partial<Response>;
    let user : User;
    let requestUser : any;

    beforeEach(() => {
        userService = sinon.createStubInstance(UserService);
        jwtService = sinon.createStubInstance(JwtService);

        authController = new AuthController(userService, jwtService);
        
        req = {} as Partial<Request>;
        res = {} as Partial<Response>;

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
        // Mock request and response objects
        req.body = requestUser;
        const stub = sinon.stub();
        res.json = stub;

        // Stub the getUserByNameWithPassword method of the userService to return the user
        userService.getUserByNameWithPassword = sinon.stub().returns(user);
        jwtService.generateToken = sinon.stub().returns('token');

        // Call the login method
        await authController.login(req as Request, res as Response);

        // Assert that the response status is 200
        expect(stub.calledWith({token: 'token', role: user.role})).to.be.ok;
    });

    it('should not login a user with missing fields', async () => {
        // Mock request and response objects
        req.body = {
            name: user.name,
        };
        const stub = sinon.stub().returnsThis();
        res.status = stub;
        res.send = sinon.stub();

        // Call the login method
        await authController.login(req as Request, res as Response);

        // Assert that the response status is 400
        expect(stub.calledWith(400)).to.be.ok;
    });

    it('should not login a user that does not exist', async () => {
        // Mock request and response objects
        req.body = requestUser;
        const stub = sinon.stub().returnsThis();
        res.status = stub;
        res.send = sinon.stub();

        // Stub the getUserByNameWithPassword method of the userService to return undefined
        userService.getUserByNameWithPassword = sinon.stub().returns(undefined);

        // Call the login method
        await authController.login(req as Request, res as Response);

        // Assert that the response status is 404
        expect(stub.calledWith(404)).to.be.ok;
    });

    it('should not login a user with an invalid password', async () => {
        // Mock request and response objects
        requestUser.password = 'wrongpassword';
        req.body = requestUser;
        const stub = sinon.stub().returnsThis();
        res.status = stub;
        res.send = sinon.stub();

        // Stub the getUserByNameWithPassword method of the userService to return the user
        userService.getUserByNameWithPassword = sinon.stub().returns(user);

        // Call the login method
        await authController.login(req as Request, res as Response);

        // Assert that the response status is 401
        expect(stub.calledWith(401)).to.be.ok;
    });

    it('should not login a user if the user object has invalid field', async () => {
        // Mock request and response objects
        requestUser.name = 10;
        req.body = requestUser;
        const stub = sinon.stub().returnsThis();
        res.status = stub;
        res.send = sinon.stub();

        // Call the login method
        await authController.login(req as Request, res as Response);

        // Assert that the response status is 400
        expect(stub.calledWith(400)).to.be.ok;
    });
});