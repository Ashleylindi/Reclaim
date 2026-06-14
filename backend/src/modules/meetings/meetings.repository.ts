import { Inject, Injectable } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';
import { DATABASE_CONNECTION } from '../../database/mongo.constants';

@Injectable()
export class MeetingsRepository {
  private collectionName = 'meetings';

  constructor(
    @Inject(DATABASE_CONNECTION)
    private db: Db,
  ) {}

  private get collection() {
    return this.db.collection(this.collectionName);
  }

  async create(meeting: any) {
    const doc = {
      ...meeting,
      attended: false,
      createdAt: new Date().toISOString(),
    };
    const result = await this.collection.insertOne(doc);
    return { ...doc, _id: result.insertedId };
  }

  async findByUser(userId: string) {
    return this.collection
      .find({ userId: new ObjectId(userId) })
      .sort({ date: 1 })
      .toArray();
  }

  async markAttended(id: string) {
    return this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          attended: true,
          updatedAt: new Date().toISOString(),
        },
      },
    );
  }

  async update(id: string, update: any) {
    return this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...update,
          updatedAt: new Date().toISOString(),
        },
      },
    );
  }

  async delete(id: string) {
    return this.collection.deleteOne({
      _id: new ObjectId(id),
    });
  }
}
