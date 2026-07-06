import { Component } from '@angular/core';
import { WordStatistics } from '../../../components/words/statistics/word-statistics/word-statistics'
import { WordSummary } from '../../../components/words/statistics/word-summary/word-summary'

@Component({
  selector: 'app-minigames',
  imports: [WordStatistics, WordSummary],
  templateUrl: './minigames.html',
  styleUrl: './minigames.scss',
})
export class Minigames {}
