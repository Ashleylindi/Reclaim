import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { DATABASE_CONNECTION } from '../../database/mongo.constants';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersRepository {
  private collectionName = 'users';

  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: Db,
  ) {}

  private get collection() {
    return this.db.collection<User>(this.collectionName);
  }

  async create(user: User) {
    return this.collection.insertOne(user);
  }

  async findByEmail(email: string) {
    return this.collection.findOne({ email });
  }

  async findById(id: string) {
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async update(id: string, update: Partial<User>) {
    return this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update },
    );
  }

  async pushToArray(id: string, field: string, value: any) {
    return this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { [field]: value },
        $set: { updatedAt: new Date().toISOString() },
      },
    );
  }
}
