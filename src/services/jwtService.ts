import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    name: string;
}

class JwtService {
    private secretKey: string;

    constructor(secretKey: string) {
        this.secretKey = secretKey;
    }

    generateToken(payload: object, expiresIn: string): string {
        return jwt.sign(payload, this.secretKey, { expiresIn });
    }

    verifyToken(token: string): CustomJwtPayload {
        const payload = jwt.verify(token, this.secretKey);
        if (typeof payload === 'string') {
            throw new Error('Invalid payload');
        }
        return payload as CustomJwtPayload;
    }
}

export default JwtService;