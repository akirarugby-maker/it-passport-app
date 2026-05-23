import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, AnswerRecord, Domain, QuizMode, RepetitionRecord } from '@/types';
import { format } from 'date-fns';

const today = () => format(new Date(), 'yyyy-MM-dd');

const defaultProgress = (): AppState['progress'] => ({
  slidesSections: {},
  questions: {},
  glossaryTerms: {},
});

type ProgressBaseline = { slide: number; quiz: number; glossary: number };

interface AppStore extends AppState {
  progressTableBaselines: Record<string, ProgressBaseline>;
  recordSlideSection: (sectionId: string) => void;
  recordQuestion: (questionId: string) => void;
  recordGlossaryTerm: (termId: string) => void;
  addAnswer: (record: AnswerRecord) => void;
  updateDailyStudy: (questionCount: number, correct: number, slides: number) => void;
  setNavigationHistory: (fromSlideId?: string, fromSectionId?: string) => void;
  clearNavigationHistory: () => void;
  resetDomainProgress: (baselines: Record<string, ProgressBaseline>) => void;
  getRepetition: (type: 'slide' | 'question' | 'glossary', id: string) => RepetitionRecord;
  getAccuracyByDomain: (domain: Domain) => number;
  getWeakQuestionIds: () => string[];
  getTodayStats: () => { questions: number; correct: number; slides: number };
  getStreak: () => number;
}

const updateRepetition = (
  record: Record<string, RepetitionRecord>,
  id: string
): Record<string, RepetitionRecord> => {
  const existing = record[id] || { count: 0, dates: [] };
  const t = today();
  const alreadyToday = existing.dates[existing.dates.length - 1] === t;
  if (alreadyToday) return record;
  return {
    ...record,
    [id]: {
      count: existing.count + 1,
      dates: [...existing.dates, t],
    },
  };
};

const computeStreak = (dailyStudy: AppState['dailyStudy']): number => {
  if (!dailyStudy.length) return 0;
  const sorted = [...dailyStudy].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const dt = new Date();
  for (const entry of sorted) {
    const expected = format(dt, 'yyyy-MM-dd');
    if (entry.date === expected) {
      streak++;
      dt.setDate(dt.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      progress: defaultProgress(),
      progressTableBaselines: {},
      answerHistory: [],
      dailyStudy: [],
      examSessions: [],
      streakDays: 0,
      lastStudyDate: '',
      navigationHistory: {},

      recordSlideSection: (sectionId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            slidesSections: updateRepetition(s.progress.slidesSections, sectionId),
          },
        })),

      recordQuestion: (questionId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            questions: updateRepetition(s.progress.questions, questionId),
          },
        })),

      recordGlossaryTerm: (termId) =>
        set((s) => ({
          progress: {
            ...s.progress,
            glossaryTerms: updateRepetition(s.progress.glossaryTerms, termId),
          },
        })),

      addAnswer: (record) => {
        set((s) => {
          const history = [...s.answerHistory, record];
          const t = today();
          const daily = [...s.dailyStudy];
          const idx = daily.findIndex((d) => d.date === t);
          if (idx >= 0) {
            daily[idx] = {
              ...daily[idx],
              questionCount: daily[idx].questionCount + 1,
              correctCount: daily[idx].correctCount + (record.isCorrect ? 1 : 0),
            };
          } else {
            daily.push({
              date: t,
              questionCount: 1,
              correctCount: record.isCorrect ? 1 : 0,
              slidesSeen: 0,
              studyMinutes: 0,
            });
          }
          return {
            answerHistory: history,
            dailyStudy: daily,
            streakDays: computeStreak(daily),
            lastStudyDate: t,
          };
        });
      },

      updateDailyStudy: (questionCount, correct, slides) =>
        set((s) => {
          const t = today();
          const daily = [...s.dailyStudy];
          const idx = daily.findIndex((d) => d.date === t);
          if (idx >= 0) {
            daily[idx] = {
              ...daily[idx],
              questionCount: daily[idx].questionCount + questionCount,
              correctCount: daily[idx].correctCount + correct,
              slidesSeen: daily[idx].slidesSeen + slides,
            };
          } else {
            daily.push({ date: t, questionCount, correctCount: correct, slidesSeen: slides, studyMinutes: 0 });
          }
          return { dailyStudy: daily, streakDays: computeStreak(daily) };
        }),

      setNavigationHistory: (fromSlideId, fromSectionId) =>
        set({ navigationHistory: { fromSlideId, fromSectionId } }),

      clearNavigationHistory: () => set({ navigationHistory: {} }),

      resetDomainProgress: (baselines) =>
        set((s) => ({
          progressTableBaselines: { ...s.progressTableBaselines, ...baselines },
        })),

      getRepetition: (type, id) => {
        const s = get().progress;
        const map = type === 'slide' ? s.slidesSections : type === 'question' ? s.questions : s.glossaryTerms;
        return map[id] || { count: 0, dates: [] };
      },

      getAccuracyByDomain: (domain) => {
        // Import lazily to avoid circular deps
        const allQuestions = get().answerHistory;
        if (!allQuestions.length) return 0;
        void domain;
        const correct = allQuestions.filter((a) => a.isCorrect).length;
        return Math.round((correct / allQuestions.length) * 100);
      },

      getWeakQuestionIds: () => {
        const history = get().answerHistory;
        const counts: Record<string, { total: number; correct: number }> = {};
        for (const a of history) {
          if (!counts[a.questionId]) counts[a.questionId] = { total: 0, correct: 0 };
          counts[a.questionId].total++;
          if (a.isCorrect) counts[a.questionId].correct++;
        }
        return Object.entries(counts)
          .filter(([, v]) => v.total >= 1 && v.correct / v.total < 0.6)
          .map(([id]) => id);
      },

      getTodayStats: () => {
        const t = today();
        const entry = get().dailyStudy.find((d) => d.date === t);
        return entry
          ? { questions: entry.questionCount, correct: entry.correctCount, slides: entry.slidesSeen }
          : { questions: 0, correct: 0, slides: 0 };
      },

      getStreak: () => get().streakDays,
    }),
    {
      name: 'it-passport-storage',
      version: 1,
    }
  )
);
