/**
 * Trivia Game Types
 * Types for trivia game session management
 */

export interface TriviaGameSession {
  questionCount: number;
  answeredTiles: Set<string>;
  score: number; // Total points earned
  correct: number; // Number of correct answers
  totalAnswered: number; // Total questions answered
  cardId: number; // Which carousel card this session belongs to
}

export interface TriviaQuestionData {
  question_text: string;
  correct_answer: string;
  wrong_answers?: string[];
  is_true?: boolean;
  explanation?: string | null;
  points?: number;
  difficulty?: string | null;
  question_type?: string;
}

export interface TriviaAnswerResult {
  isCorrect: boolean;
  pointsGained: number;
  correctAnswer: string;
  explanation?: string | null;
}
