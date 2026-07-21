import { Component, OnInit } from '@angular/core';
import { WordStatistics } from '../../../components/words/statistics/word-statistics/word-statistics'
import { WordSummary } from '../../../components/words/statistics/word-summary/word-summary'
import { AnkiGame } from '../../../components/minigames/anki-game/anki-game'
import { QuizGame } from '../../../components/minigames/quiz-game/quiz-game'
import { Minigames as MinigamesService } from '../../../services/minigames/minigames'

@Component({
  selector: 'app-minigames',
  imports: [WordStatistics, WordSummary, AnkiGame, QuizGame],
  templateUrl: './minigames.html',
  styleUrl: './minigames.scss',
})
export class Minigames {
  constructor(private minigamesService: MinigamesService) {}

  activatedGame: 'ANKI' | 'QUIZ' | null = null;

  activateGame(game: 'ANKI' | 'QUIZ') {
    this.activatedGame = game;
  }

  deactivateGame() {
    this.activatedGame = null;
    this.minigamesService.exitToMainPage();
  }
}
