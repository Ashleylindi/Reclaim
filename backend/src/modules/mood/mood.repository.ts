import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { DATABASE_CONNECTION } from '../../database/mongo.constants';

@Injectable()
export class MoodRepository {
  private collectionName = 'moodLogs';

  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: Db,
  ) {}

  private get collection() {
    return this.db.collection(this.collectionName);
  }

  async create(entry: any) {
    const doc = {
      ...entry,
      createdAt: new Date().toISOString(),
    };
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async findByUser(userId: string) {
    return this.collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async getLatest(userId: string) {
    return this.collection.findOne(
      { userId: new ObjectId(userId) },
      { sort: { createdAt: -1 } },
    );
  }

  async delete(id: string) {
    return this.collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}
