import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;

  name: string;
  email: string;
  password: string;
  contact: string;

  sponsor?: {
    name?: string;
    email?: string;
    phone?: string;
  };

  therapist?: {
    name?: string;
    phone?: string;
  };

  trustedFriend?: {
    name?: string;
    phone?: string;
  };

  emergencyContact?: {
    name?: string;
    email?: string;
    phone?: string;
    relationship?: string;
  };

  soberStats: {
    daysSober: number;
    startDate: string;
  };

  moodLog: {
    date: string;
    mood: string;
  }[];

  meetings: {
    title: string;
    date: string;
    location?: string;
    attended: boolean;
  }[];

  journalEntries: {
    date: string;
    text: string;
    mood?: string;
  }[];

  createdAt: string;
  updatedAt: string;
}
