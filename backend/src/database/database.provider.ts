import { MongoClient, Db } from 'mongodb';
import { DATABASE_CONNECTION, MONGO_CLIENT } from './mongo.constants';

export const databaseProviders = [
  {
    provide: MONGO_CLIENT,
    useFactory: async (): Promise<MongoClient> => {
      const client = new MongoClient(process.env.MONGO_URI as string);

      await client.connect();

      console.log('🟢 MongoDB connected');

      return client;
    },
  },

  {
    provide: DATABASE_CONNECTION,
    useFactory: (client: MongoClient): Db => {
      return client.db(process.env.MONGO_DB_NAME);
    },
    inject: [MONGO_CLIENT],
  },
];
