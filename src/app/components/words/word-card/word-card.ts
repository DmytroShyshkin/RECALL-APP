import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Words } from '../../../services/words/words';
import { PageResponse, WordsDTO } from '../../../models/words/words.model';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-word-card',
  imports: [FormsModule],
  templateUrl: './word-card.html',
  styleUrl: './word-card.scss',
})
export class WordCard implements OnInit {
  pageResponse: PageResponse<WordsDTO> | null = null;
  pageNo: number = 0;
  pageSize: number = 10;
  ownerEmail: string = '';

  searchQuery = '';
  selectedLanguage = '';

  constructor(private wordsService: Words, private authService: AuthService) {}

  ngOnInit(): void {
    const email = this.authService.getEmailFromToken();
    if (email) {
      this.ownerEmail = email;
      this.loadWords();
    }
  }

  loadWords(): void {
    this.wordsService.getWordsByOwner(this.pageNo, this.pageSize).subscribe({
      next: (response) => {
        this.pageResponse = response;
      },
      error: (err) => console.error('Error:', err),
    });
  }

  get availableLanguages(): string[] {
    if (!this.pageResponse) return [];
    return [...new Set(this.pageResponse.content.map(w => w.sourceLanguage))];
  }

  get filteredWords(): WordsDTO[] {
    if (!this.pageResponse) return [];
    
    return this.pageResponse.content.filter(word => {      
      const matchesSearch = word.originalWord
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());

      const matchesLanguage = this.selectedLanguage
        ? word.sourceLanguage === this.selectedLanguage
        : true;

      return matchesSearch && matchesLanguage;
    });
  }
}
