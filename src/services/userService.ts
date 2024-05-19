import { PublicUser, User } from '../models/user';
import DatabaseService from '../services/databaseService';

class UserService {
    private databaseService: DatabaseService;

    constructor(databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async createUser(user: User): Promise<boolean> {
        const result = await this.databaseService.getCollection('users').insertOne(user);
        return result.acknowledged;
    }

    public async getUserByName(name: string): Promise<PublicUser | undefined> {
        const dbUser = await this.databaseService.getCollection('users').findOne({ name: name });
        if (dbUser) {
            return this.dbToPublicUser(dbUser);
        }
    }

    public async getUserByNameWithPassword(name: string): Promise<User | undefined> {
        const dbUser = await this.databaseService.getCollection('users').findOne({ name: name });
        if (dbUser) {
            return this.dbToUser(dbUser);
        }
    }

    public async updateUser(name : string, user: User): Promise<boolean> {
        const result = await this.databaseService.getCollection('users').updateOne({ name: name }, { $set: user });
        return result.modifiedCount > 0;
    }

    public async deleteUser(id: string): Promise<boolean> {
        const result = await this.databaseService.getCollection('users').deleteOne({ id: id });
        return result.deletedCount > 0;
    }

    public async getAllUsers(): Promise<PublicUser[]> {
        const dbUsers = await this.databaseService.getCollection('users').find().toArray();
        const users = dbUsers.map(dbUsers => this.dbToPublicUser(dbUsers));
        return users;
    }

    public async createAdminIfNotExist(): Promise<void> {
        const adminUser = await this.getUserByName("admin")
        
        if (adminUser) {
            return
        }
        const newUser = {
            name: "admin",
            email: "email",
            password: "password",
            role: "admin"
        } as User
        if (!await this.createUser(newUser)) {
            console.error("Failed to create admin")
        }
      }

    private dbToUser(dbUser: any): User {
        return {
            name: dbUser.name,
            email: dbUser.email,
            password: dbUser.password,
            role: dbUser.role
        };
    }

    private dbToPublicUser(dbUser: any): PublicUser {
        return {
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role
        };
    }

}

export default UserService;