import { Component } from '@angular/core';
import { Words } from '../../../services/words/words';
import { WordsDTO } from '../../../models/words/words.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslationDTO } from '../../../models/translations/translations.model';

@Component({
  selector: 'app-update-word-dialoge',
  imports: [],
  templateUrl: './update-word-dialoge.html',
  styleUrl: './update-word-dialoge.scss',
})
export class UpdateWordDialoge {
  selectedWord: WordsDTO | null = null;
  selectedTranslation: TranslationDTO | null = null;
  editForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private wordsService: Words) {
    this.editForm = this.formBuilder.group({
      sourceLanguage: [''],
      originalWord: [''],
      targetLanguage: [''],
      translatedWord: [''],
      description: ['']
    });
  }
selectTranslation(translation: TranslationDTO) {
    this.selectedTranslation = translation;
    this.editForm.patchValue({
      targetLanguage: translation.targetLanguage,
      translatedWord: translation.translatedWord,
      description: translation.description
    });
  }

  saveTranslation() {
    if (!this.selectedTranslation || !this.selectedWord) return;

    const updated: TranslationDTO = {
      ...this.selectedTranslation,
      targetLanguage: this.editForm.value.targetLanguage,
      translatedWord: this.editForm.value.translatedWord,
      description: this.editForm.value.description
    };

    this.wordsService.updateTranslation(updated); // твой API-метод
  }
}
