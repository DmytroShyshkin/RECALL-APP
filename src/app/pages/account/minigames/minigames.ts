import { Component } from '@angular/core';
import { WordStatistics } from '../../../components/words/statistics/word-statistics/word-statistics'
import { WordSummary } from '../../../components/words/statistics/word-summary/word-summary'
import { AnkiGame } from '../../../components/minigames/anki-game/anki-game'
import { QuizGame } from '../../../components/minigames/quiz-game/quiz-game'

@Component({
  selector: 'app-minigames',
  imports: [WordStatistics, WordSummary, AnkiGame, QuizGame],
  templateUrl: './minigames.html',
  styleUrl: './minigames.scss',
})
export class Minigames {
  activatedGame: 'ANKI' | 'QUIZ' | null = null;

  activateGame(game: 'ANKI' | 'QUIZ') {
    this.activatedGame = game;
  }

  deactivateGame() {
    this.activatedGame = null;
  }
}
