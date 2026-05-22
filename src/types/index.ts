export type Domain = 'strategy' | 'management' | 'technology';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  domain: Domain;
  category: string;
  text: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  year?: string;
  source?: 'ipa' | 'original';
  keywords?: string[];
  relatedSlideId?: string;
  relatedGlossaryIds?: string[];
}

export interface SlideSection {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  keywords: string[];
  relatedQuestionIds?: string[];
  relatedGlossaryIds?: string[];
}

export interface Slide {
  id: string;
  domain: Domain;
  category: string;
  title: string;
  sections: SlideSection[];
  quizQuestionIds: string[];
  order: number;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  reading?: string;
  domain: Domain;
  category: string;
  definition: string;
  example?: string;
  relatedTermIds?: string[];
  relatedSlideId?: string;
  relatedQuestionIds?: string[];
}

export interface RepetitionRecord {
  count: number;
  dates: string[];
}

export interface StudyProgress {
  slidesSections: Record<string, RepetitionRecord>;
  questions: Record<string, RepetitionRecord>;
  glossaryTerms: Record<string, RepetitionRecord>;
}

export interface DailyStudy {
  date: string;
  questionCount: number;
  correctCount: number;
  slidesSeen: number;
  studyMinutes: number;
}

export interface AnswerRecord {
  questionId: string;
  isCorrect: boolean;
  selectedIndex: number;
  timestamp: string;
  mode: QuizMode;
}

export type QuizMode = 'domain' | 'weak' | 'random' | 'exam';

export interface ExamSession {
  id: string;
  startTime: string;
  endTime?: string;
  answers: AnswerRecord[];
  mode: QuizMode;
  domain?: Domain;
  totalQuestions: number;
}

export interface AppState {
  progress: StudyProgress;
  answerHistory: AnswerRecord[];
  dailyStudy: DailyStudy[];
  examSessions: ExamSession[];
  streakDays: number;
  lastStudyDate: string;
  navigationHistory: {
    fromSlideId?: string;
    fromSectionId?: string;
  };
}

export interface DomainStats {
  domain: Domain;
  totalAnswered: number;
  correctAnswered: number;
  accuracy: number;
  masteredCount: number;
  totalCount: number;
}
