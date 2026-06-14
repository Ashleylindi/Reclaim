import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Db, ObjectId } from 'mongodb';

import { AiProvider } from './providers/ai.provider';

import {
  calculateMoodRisk,
  calculateMeetingRisk,
  calculateJournalRisk,
  combineRisk,
  getRiskLevel,
} from './intelligence/relapse.engine';

import { evaluateAlert } from './alerts/alert.engine';
import { buildDashboardPrompt } from './intelligence/ai.analysis';

function cleanJson(input: string) {
  return input
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}

@Injectable()
export class AiService {
  private ai: AiProvider;

  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {
    this.ai = new AiProvider();
  }

  async getDashboard(userId: string) {
    const user = await this.db.collection('users').findOne({
      _id: new ObjectId(userId),
    });

    const moodDocs = await this.db
    .collection('moods')
    .find({ userId: new ObjectId(userId) })
    .sort({ date: -1 })
    .limit(7)
    .toArray();

    const moods = moodDocs.map((m: any) => m.mood);

    const journals = await this.db
      .collection('journalEntries')
      .find({ userId: new ObjectId(userId) })
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    const meetings = await this.db
    .collection('meetings')
    .find({ userId: new ObjectId(userId) })
    .toArray();

    // STREAK (existing function assumed)
    const startDate = user?.soberStats?.startDate;
    const daysSober = startDate
      ? Math.floor((Date.now() - new Date(startDate).getTime()) / 86_400_000)
      : 0;

    // RELAPSE ENGINE
    const moodRisk = calculateMoodRisk(moods);
    const meetingRisk = calculateMeetingRisk(meetings);
    const journalRisk = calculateJournalRisk(journals);

    const riskScore = combineRisk({
      moodRisk,
      meetingRisk,
      journalRisk,
    });

    const riskLevel = getRiskLevel(riskScore);

    // ALERT SYSTEM (NEW)
    const alert = evaluateAlert(riskScore);

    const prompt = buildDashboardPrompt({
      riskScore,
      riskLevel,
      journals,
      moods,
      daysSober,
    });

    const aiResponse = await this.ai.chat([
      {
        role: 'system',
        content:
          'Strict JSON recovery AI. No markdown. No backticks.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    let parsed;

    try {
      parsed = JSON.parse(cleanJson(aiResponse));
    } catch {
      parsed = {
        summary: aiResponse,
        patterns: 'unknown',
        advice: 'Stay consistent',
        encouragement: 'You are doing better than you think',
      };
    }

    if (alert.action === 'notify_sponsor') {
      console.log('📣 NOTIFY SPONSOR:', user?.sponsor);
    }

    if (alert.action === 'notify_emergency_contact') {
      console.log('🚨 EMERGENCY CONTACT:', user?.emergencyContact);
    }

    return {
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
      },

      streak: {
        daysSober,
        startDate: user?.soberStats?.startDate,
      },

      relapse: {
        riskScore,
        riskLevel,
        alert,
        breakdown: {
          moodRisk,
          meetingRisk,
          journalRisk,
        },
      },

      aiInsights: parsed,
    };
  }
}
