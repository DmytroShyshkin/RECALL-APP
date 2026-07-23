import { Component, OnInit } from '@angular/core';
import { Words } from '../../../../services/words/words';
import { UserStatsSummaryDTO } from '../../../../models/words/words.model';

@Component({
  selector: 'app-word-summary',
  imports: [],
  templateUrl: './word-summary.html',
  styleUrl: './word-summary.scss',
})
export class WordSummary implements OnInit {
  constructor(private wordsService: Words) {}
  
  userStatsSummary: UserStatsSummaryDTO | null = null;

  ngOnInit(): void {
    this.getUserStatsSummary();
  }

  getUserStatsSummary(): void {
    this.wordsService.getUserStatsSummary().subscribe({
      next: (response) => this.userStatsSummary = response,
      error: (err) => console.error('Error:', err),
    });
  }
}
