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
  isGameInitialized: boolean = false;

  // Anki Card related properties
  AnkiDeckCards: AnkiCardResponse[] = [];
  ankiCard: AnkiCardResponse | null = null;

  isLastCardSame(): boolean {
    const lastCard = this.AnkiDeckCards[this.AnkiDeckCards.length - 1];

    if (!lastCard || !this.ankiCard) {
      return false;
    }

    return lastCard.id === this.ankiCard.id;
  }

  // FormGroup to handle the form data
  ankiForm: FormGroup;

  constructor(private fb: FormBuilder, private minigameService: MinigameService) {
    this.ankiForm = this.fb.group({
      sourceLanguage: ['', Validators.required],
      targetLanguage: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.ankiForm.valid) {
      const { sourceLanguage, targetLanguage } = this.ankiForm.value;

      // Call the service to initialize the Anki game
      this.minigameService.initializeAnkiGame({ sourceLanguage, targetLanguage }).subscribe({
        next: (response) => {
          this.AnkiDeckCards = response as AnkiCardResponse[];
          this.isGameInitialized = true;
          this.nextAnkiCard(); // Fetch the first Anki card after initialization
          console.log('Form Data:', { sourceLanguage, targetLanguage });
        },
        error: (err) => {
          console.error('Error initializing Anki game:', err);
        }
      });
    }
  }
  // ~FormGroup

  nextAnkiCard() {
    this.minigameService.nextAnkiCard().subscribe({
      next: (response: any) => {
        this.ankiCard = response as AnkiCardResponse;
        this.isLastCardSame(); // Check if the last card is the same as the current one
        console.log('Next Anki Card:', this.ankiCard);
      },
      error: (err) => console.error('Error:', err),
    });
  }

  reviewAnkiCard(id: string, rating: number) {
    this.minigameService.reviewAnkiCard(id, rating).subscribe({
      next: (response) => {
        console.log('Card reviewed successfully:', response);
        this.nextAnkiCard(); // Fetch the next Anki card after reviewing the current one
      },
      error: (err) => console.error('Error reviewing card:', err),
    });
  }

  // Auxiliary function to format the date for display
  formatingData(data: string): string {
    const date = new Date(data);

    const formatted = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    return formatted;
  }
}