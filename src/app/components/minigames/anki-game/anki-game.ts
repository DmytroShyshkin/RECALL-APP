import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Minigames as MinigameService } from '../../../services/minigames/minigames';
import { AnkiCardResponse } from '../../../models/minigames/minagames.model'
import { Languages } from '../../../services/languages/languages';
import { LanguagePicker } from '../../shared/language-picker/language-picker';

@Component({
  selector: 'app-anki-game',
  imports: [ReactiveFormsModule, LanguagePicker],
  templateUrl: './anki-game.html',
  styleUrl: './anki-game.scss',
})
export class AnkiGame implements OnInit {
  isGameInitialized = false;
  isGameFinished = false;

  ankiCard: AnkiCardResponse | null = null;
  lastReviewedCard: AnkiCardResponse | null = null;

  knownLanguages: string[] = [];

  ankiForm: FormGroup;

  constructor(private fb: FormBuilder, private minigameService: MinigameService, private languagesService: Languages) {
    this.ankiForm = this.fb.group({
      sourceLanguage: ['', Validators.required],
      targetLanguage: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.languagesService.getKnownLanguages().subscribe({
      next: (languages) => this.knownLanguages = languages,
      error: (err) => console.error('Error loading known languages:', err),
    });
  }

  onSubmit() {
    if (!this.ankiForm.valid) return;
    const { sourceLanguage, targetLanguage } = this.ankiForm.value;

    // сброс на случай, если инстанс компонента переиспользуется без пересоздания
    this.isGameFinished = false;
    this.ankiCard = null;
    this.lastReviewedCard = null;

    this.minigameService.initializeAnkiGame({ sourceLanguage, targetLanguage }).subscribe({
      next: () => {
        this.isGameInitialized = true;
        this.nextAnkiCard();
      },
      error: (err) => console.error('Error initializing Anki game:', err),
    });
  }

  nextAnkiCard() {
    this.minigameService.nextAnkiCard().subscribe({
      next: (response) => {
        if (!response) {
          this.isGameFinished = true;
          this.ankiCard = null;
          return;
        }
        this.ankiCard = response as AnkiCardResponse;
      },
      error: () => {
        this.isGameFinished = true;
        this.ankiCard = null;
      },
    });
  }

  reviewAnkiCard(id: string, rating: number) {
    this.minigameService.reviewAnkiCard(id, rating).subscribe({
      next: (response) => {
        this.lastReviewedCard = response as AnkiCardResponse;
        this.nextAnkiCard();
      },
      error: (err) => console.error('Error reviewing card:', err),
    });
  }

  formatingData(data: string): string {
    const date = new Date(data);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}