import { Component, OnInit } from '@angular/core';
import { Words } from '../../../../services/words/words';
import { WordsDTO } from '../../../../models/words/words.model';
import { WordStatisticsDTO } from '../../../../models/words/words.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-statistics',
  imports: [CommonModule],
  templateUrl: './word-statistics.html',
  styleUrl: './word-statistics.scss',
})

export class WordStatistics implements OnInit {
  constructor(private wordsService: Words) { }

  wordStatistics: WordStatisticsDTO[] = [];

  ngOnInit(): void {
    this.wordsService.getWordsByOwner(0, 50).subscribe({
      next: (wordsResponse) => {
        this.getWordStatistics(wordsResponse.content);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  getWordStatistics(words: WordsDTO[]): void {
    this.wordsService.getWordStatistics().subscribe({
      next: (response) => {
        console.log('word ids:', words.map(w => w.id));
        console.log('stat wordIds:', response.map(s => s.wordId));

        this.wordStatistics = response.map(stat => {

          return {
            ...stat,
            lastReviewedAt: stat.lastReviewedAt
              ? new Date(stat.lastReviewedAt).toLocaleString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit'
              })
              : null
          };
        });
      },
      error: (err) => console.error('Error:', err),
    });
  }
}

