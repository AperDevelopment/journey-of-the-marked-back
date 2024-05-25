import { Request, Response } from 'express';
import { expect } from 'chai';
import sinon from 'sinon';
import AuthController from '../../src/controllers/authController';
import UserService from '../../src/services/userService';
import JwtService from '../../src/services/jwtService';

describe('AuthController', () => {
    let authController: AuthController;
    let userService: UserService;
    let jwtService: JwtService;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        userService = sinon.createStubInstance(UserService);
        jwtService = sinon.createStubInstance(JwtService);

        authController = new AuthController(userService, jwtService);
        
        req = {} as Partial<Request>;
        res = {} as Partial<Response>;
    });

    describe('register', () => {
        it('should register a new user', async () => {
            // Mock request and response objects
            req.body = {
                name: 'testname',
                email: 'testemail',
                password: 'testpassword',
            };
            const stub = sinon.stub().returnsThis();
            res.status = stub;
            res.send = sinon.stub();

            // Stub the getUserByName method of the userService to return undefined
            userService.getUserByName = sinon.stub().returns(undefined);
            userService.createUser = sinon.stub().returns(true);

            // Call the register method
            await authController.register(req as Request, res as Response);

            console.log(res.status);

            // Assert that the response status is 200 and the user is registered
            expect(stub.calledWith(200)).to.be.ok;
        });
    });
})