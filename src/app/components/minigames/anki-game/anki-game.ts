import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Minigames as MinigameService } from '../../../services/minigames/minigames';
import { AnkiCardResponse } from '../../../models/minigames/minagames.model'

@Component({
  selector: 'app-anki-game',
  imports: [ReactiveFormsModule],
  templateUrl: './anki-game.html',
  styleUrl: './anki-game.scss',
})
export class AnkiGame {
  isGameInitialized = false;
  isGameFinished = false;

  ankiCard: AnkiCardResponse | null = null;
  lastReviewedCard: AnkiCardResponse | null = null;

  ankiForm: FormGroup;

  constructor(private fb: FormBuilder, private minigameService: MinigameService) {
    this.ankiForm = this.fb.group({
      sourceLanguage: ['', Validators.required],
      targetLanguage: ['', Validators.required],
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
    return date.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}