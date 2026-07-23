// Anki
export interface AnkiCardResponse {
    id: string;
    wordId: string;
    word: string;
    translations: string[];
    state: CardState;
    retrievability: number;
    nextReviewAt: string;
}

export enum CardState {
    NEW = 'NEW',
    LEARNING = 'LEARNING',
    REVIEW = 'REVIEW',
    RELEARNING = 'RELEARNING',
}
// ~Anki

// Quiz
export interface QuizSessionResponse{
    sessionId: string;
    currentIndex: number;
    totalQuestions: number;
    score: number;
    completed: boolean;
    correctAnswer: QuizQuestionResponse[];
    wrongAnswer: QuizQuestionResponse[];
    currentQuestion: QuizQuestionResponse;
}

export interface QuizQuestionResponse{
    wordId: string;
    question: string;
    options: string[];
    language: string[];
}
// ~Quiz