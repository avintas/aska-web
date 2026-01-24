/**
 * Trivia Game Session Utilities
 * Manages game session state, scoring, and answer validation
 */

import type { TriviaGameSession, TriviaQuestionData, TriviaAnswerResult } from "@/shared/types/trivia-game";

/**
 * Creates a new trivia game session
 */
export function createGameSession(
  questionCount: number,
  cardId: number,
): TriviaGameSession {
  return {
    questionCount,
    answeredTiles: new Set<string>(),
    score: 0,
    correct: 0,
    totalAnswered: 0,
    cardId,
  };
}

/**
 * Processes an answer and updates the session
 */
export function answerQuestion(
  session: TriviaGameSession,
  tileId: string,
  userAnswer: string,
  questionData: TriviaQuestionData,
): TriviaAnswerResult {
  const isCorrect = checkAnswer(userAnswer, questionData);
  const pointsGained = isCorrect ? (questionData.points || 10) : 0;

  // Update session
  session.answeredTiles.add(tileId);
  session.totalAnswered += 1;
  if (isCorrect) {
    session.correct += 1;
    session.score += pointsGained;
  }

  return {
    isCorrect,
    pointsGained,
    correctAnswer: questionData.correct_answer,
    explanation: questionData.explanation || null,
  };
}

/**
 * Checks if the user's answer is correct
 */
function checkAnswer(userAnswer: string, questionData: TriviaQuestionData): boolean {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = questionData.correct_answer.trim().toLowerCase();

  // For true/false questions (check is_true field first)
  if (questionData.is_true !== undefined) {
    // User answer could be "true" or "True" or "false" or "False"
    const userBool = normalizedUserAnswer === "true";
    return userBool === questionData.is_true;
  }

  // For multiple choice questions - compare normalized strings
  // Also handle case where correct_answer might be "True"/"False" for true/false
  if (normalizedCorrectAnswer === "true" || normalizedCorrectAnswer === "false") {
    const userBool = normalizedUserAnswer === "true";
    const correctBool = normalizedCorrectAnswer === "true";
    return userBool === correctBool;
  }

  return normalizedUserAnswer === normalizedCorrectAnswer;
}

/**
 * Checks if the game session is complete
 */
export function isGameComplete(session: TriviaGameSession): boolean {
  return session.totalAnswered >= session.questionCount;
}

/**
 * Gets the current score percentage
 */
export function getScorePercentage(session: TriviaGameSession): number {
  if (session.totalAnswered === 0) return 0;
  return Math.round((session.correct / session.totalAnswered) * 100);
}

/**
 * Gets formatted score display text
 */
export function getScoreDisplay(session: TriviaGameSession): string {
  const percentage = getScorePercentage(session);
  return `${session.totalAnswered}/${session.questionCount} answered • Score: ${percentage}% • ${session.score} points`;
}

/**
 * Resets a game session
 */
export function resetSession(session: TriviaGameSession): TriviaGameSession {
  return createGameSession(session.questionCount, session.cardId);
}
