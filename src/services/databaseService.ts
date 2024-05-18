import { MongoClient, Db } from 'mongodb';

class DatabaseService {
    private client: MongoClient;
    private db: Db;

    constructor() {
        const user = process.env.MONGO_USERNAME;
        const password = process.env.MONGO_PASSWORD;
        const uri = `mongodb://${user}:${password}@mongo:27017`
        this.client = new MongoClient(uri);
        this.db = {} as Db; // Initialize the 'db' property
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.db = this.client.db('journey-of-the-marked');
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
        }
    }

    getCollection(collectionName: string) {
        return this.db.collection(collectionName);
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.close();
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Failed to disconnect from MongoDB:', error);
        }
    }
}

export default DatabaseService;