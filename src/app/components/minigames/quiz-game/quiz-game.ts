import { Component, OnInit } from '@angular/core';
import { Minigames as MinigamesService } from '../../../services/minigames/minigames'
import { QuizSessionResponse } from '../../../models/minigames/minagames.model'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-quiz-game',
  imports: [ReactiveFormsModule],
  templateUrl: './quiz-game.html',
  styleUrl: './quiz-game.scss',
})
export class QuizGame implements OnInit {

  languages: string[] | null = null;
  wordCount: number | null = 4;

  quizForm: FormGroup;

  constructor(private fb: FormBuilder, private minigamesService: MinigamesService) {
    this.quizForm = this.fb.group({
      languages: ['', Validators.required],
      wordCount: ['']
    })
  }

  quizSession: QuizSessionResponse | null = null;
  isGameInitialized: boolean = false;

  ngOnInit() {
    this.minigamesService.registerExitCallback(() => {
      this.exitQuizGame();
    });
  }

  onSubmit() {
    const { languages, wordCount } = this.quizForm.value;

    // Default to 3 if the provided word count is not valid
    const finalWordCount = Number(wordCount) > 0 ? Number(wordCount) : 3;
    // Split the languages string into an array and trim whitespace
    this.languages = (languages as string).split(',').map((l: string) => l.trim());

    this.wordCount = finalWordCount;

    if (this.quizForm.valid) {
      this.minigamesService.startQuiz({
        languages: this.languages,
        wordCount: this.wordCount
      }).subscribe({
        next: (response) => {
          this.quizSession = response as QuizSessionResponse;
          this.isGameInitialized = true;
          console.log('Quiz game initialized with languages:', languages, 'and word count:', wordCount);
        },
        error: (err) => {
          console.error('Error starting quiz game:', err);
        }
      });
    }
  }

  answerQuizQuestionGame(optionAnswer: string) {
    if (this.quizSession) {
      // Send the answer to the backend
      this.minigamesService.answerQuizQuestion(this.quizSession.sessionId, optionAnswer).subscribe({
        next: (response) => {
          this.quizSession = response as QuizSessionResponse; // Update the quiz session with the new state after answering
        }
      });
    }
  }

  exitQuizGame() {
    if (this.quizSession?.sessionId && !this.quizSession?.completed) { // Check if the session is not completed
      this.minigamesService.deleteQuizSession(this.quizSession.sessionId); // Delete the session if it's not completed
      this.quizSession = null;
      this.isGameInitialized = false;
    }
  }

  
}
