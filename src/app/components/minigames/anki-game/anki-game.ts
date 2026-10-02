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
  hasError = false;

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

    // reset in case the component instance is reused instead of recreated
    this.isGameFinished = false;
    this.hasError = false;
    this.ankiCard = null;
    this.lastReviewedCard = null;

    this.minigameService.initializeAnkiGame({ sourceLanguage, targetLanguage }).subscribe({
      next: () => {
        this.isGameInitialized = true;
        this.nextAnkiCard();
      },
      error: (err) => {
        console.error('Error initializing Anki game:', err);
        this.hasError = true;
      },
    });
  }

  nextAnkiCard() {
    this.hasError = false;
    this.minigameService.nextAnkiCard().subscribe({
      next: (response) => {
        if (!response) {
          this.isGameFinished = true;
          this.ankiCard = null;
          return;
        }
        this.ankiCard = response as AnkiCardResponse;
      },
      // Important: this catches ANY request error (expired token, network, 500,
      // etc.) — that's NOT the same as "no more cards", so the screen used to
      // wrongly show "all reviewed" even when the backend simply didn't respond.
      // hasError keeps these two states apart.
      error: (err) => {
        console.error('Error fetching next Anki card:', err);
        this.hasError = true;
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

    const diffMs = date.getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diffMs <= 0) return 'now';
    else if (diffMs <= 3600000) return rtf.format(Math.round(diffMs / 60000), 'minute');
    else if (diffMs <= 86400000) return rtf.format(Math.round(diffMs / 3600000), 'hour');

    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}