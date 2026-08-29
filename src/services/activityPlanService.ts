import { DailyActivityPlanItem, GameCategory, GameDifficulty, PatientProfile } from '../types';

export class AdaptiveCognitiveEngine {
  /**
   * Evaluates patient response latency, accuracy, and recent attempts to calculate recommended difficulty.
   */
  public static calculateDifficulty(
    accuracy: number,
    averageLatencyMs: number,
    consecutiveHighScores: number
  ): { difficulty: GameDifficulty; reason: string; trend: 'improving' | 'stable' | 'needs_gentle_support' } {
    if (accuracy >= 90 && averageLatencyMs < 2500 && consecutiveHighScores >= 2) {
      return {
        difficulty: 'medium',
        reason: `Consistent accuracy (${accuracy}%) and prompt response speed (${(averageLatencyMs / 1000).toFixed(1)}s). Gently introducing moderate cognitive stimulus.`,
        trend: 'improving',
      };
    }

    if (accuracy < 70 || averageLatencyMs > 4000) {
      return {
        difficulty: 'easy',
        reason: `Recent accuracy (${accuracy}%) indicates gentler support is optimal. Providing reassuring, simplified 3-item matching with voice encouragement.`,
        trend: 'needs_gentle_support',
      };
    }

    return {
      difficulty: 'easy',
      reason: `Stable performance (${accuracy}%) with comfortable response pacing. Maintaining consistent baseline.`,
      trend: 'stable',
    };
  }
}

export class ActivityRecommendationEngine {
  /**
   * Generates a 3-part structured daily plan (Morning, Afternoon, Evening) balancing cognitive categories.
   */
  public static generateDailyPlan(
    patient: PatientProfile,
    recentAccuracy: number = 88,
    preferredCategories: GameCategory[] = ['MEMORY', 'SOUND_RECOGNITION', 'DAILY_RECALL']
  ): DailyActivityPlanItem[] {
    const adaptive = AdaptiveCognitiveEngine.calculateDifficulty(recentAccuracy, 2100, 3);

    return [
      {
        id: 'plan_morning_focus',
        timeSlot: 'MORNING',
        scheduledTime: '09:30 AM',
        title: 'Morning Cultural Memory & Focus',
        description: 'Match familiar North Eastern silk and wildlife motifs to gently activate visual working memory.',
        category: 'MEMORY',
        gameId: 'game_memory_match',
        targetSkill: 'Visual Working Memory & Focus',
        isCompleted: false,
        recommendedDifficulty: adaptive.difficulty,
        whyRecommended: 'Morning peak alertness is ideal for visual pair recognition without cognitive overload.',
      },
      {
        id: 'plan_afternoon_reminiscence',
        timeSlot: 'AFTERNOON',
        scheduledTime: '02:30 PM',
        title: 'Afternoon Regional Sound Reminiscence',
        description: 'Listen to familiar sounds of Bihu Dhol, weaver looms, and forest streams.',
        category: 'SOUND_RECOGNITION',
        gameId: 'game_familiar_sounds',
        targetSkill: 'Auditory Memory & Calming Reminiscence',
        isCompleted: false,
        recommendedDifficulty: 'easy',
        whyRecommended: 'Soothing cultural audio provides positive emotional grounding during afternoon transitions.',
      },
      {
        id: 'plan_evening_relaxation',
        timeSlot: 'EVENING',
        scheduledTime: '06:00 PM',
        title: 'Evening Daily Routine Check & Family Connect',
        description: 'Review simple daytime steps and look through family album memories.',
        category: 'DAILY_RECALL',
        gameId: 'game_daily_routine',
        targetSkill: 'Sequential Recall & Reassurance',
        isCompleted: false,
        recommendedDifficulty: 'easy',
        whyRecommended: 'Reassuring structured check-in reduces sunset restlessness and reinforces safety.',
      },
    ];
  }
}

export const activityPlanService = {
  getDailyPlan: (patient: PatientProfile) => ActivityRecommendationEngine.generateDailyPlan(patient),
};
