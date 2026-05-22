import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Words } from '../../../services/words/words';
import { PageResponse, WordsDTO } from '../../../models/words/words.model';
import { TranslationDTO } from '../../../models/translations/translations.model';

@Component({
  selector: 'app-word-card',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './word-card.html',
  styleUrl: './word-card.scss',
})
export class WordCard implements OnInit {
  pageResponse: PageResponse<WordsDTO> | null = null;
  pageNo = 0;
  pageSize = 50;
  searchQuery = '';
  selectedLanguage = '';

  isModalOpen = false;
  selectedWord: WordsDTO | null = null;
  editForm: FormGroup;

  constructor(private wordsService: Words, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      originalWord: [''],
      sourceLanguage: ['']
    });
  }

  ngOnInit(): void {
    this.loadWords();
  }

  loadWords(): void {
    this.wordsService.getWordsByOwner(this.pageNo, this.pageSize).subscribe({
      next: (response) => this.pageResponse = response,
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
      const matchesSearch = word.originalWord.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesLanguage = this.selectedLanguage ? word.sourceLanguage === this.selectedLanguage : true;
      return matchesSearch && matchesLanguage;
    });
  }

  get translationsArray(): FormArray {
  return this.editForm.get('translations') as FormArray;
}
  
  openEdit(word: WordsDTO) {
  this.selectedWord = word;

  const translationGroups = (word.translations || []).map(t =>
    this.fb.group({
      id: [t.id],
      targetLanguage: [t.targetLanguage],
      translatedWord: [t.translatedWord],
      description: [t.description]
    })
  );

  this.editForm = this.fb.group({
    originalWord: [word.originalWord],
    sourceLanguage: [word.sourceLanguage],
    translations: this.fb.array(translationGroups)
  });

  this.isModalOpen = true;
  }

  closeEdit() {
    this.isModalOpen = false;
    this.selectedWord = null;
  }

  onSave() {
  if (!this.selectedWord) return;

  const { originalWord, sourceLanguage, translations } = this.editForm.value;

  const wordChanged = originalWord !== this.selectedWord.originalWord
    || sourceLanguage !== this.selectedWord.sourceLanguage;

  if (wordChanged) {
    this.wordsService.updateWord(this.selectedWord.id, { originalWord, sourceLanguage })
      .subscribe({ error: (err) => console.error(err) });
  }

  const originalTranslations = this.selectedWord.translations || [];
  translations.forEach((t: TranslationDTO, index: number) => {
    const original = originalTranslations[index];
    if (!original) return;

    const changed = t.translatedWord !== original.translatedWord
      || t.targetLanguage !== original.targetLanguage
      || t.description !== original.description;

    if (changed) {
      this.wordsService.updateTranslation(this.selectedWord!.id, t.id, t)
        .subscribe({ error: (err) => console.error(err) });
    }
  });

  this.loadWords();
  this.closeEdit();
}

  deleteWord(wordId: string) {
    this.wordsService.deleteWord(wordId).subscribe({
      next: () => this.loadWords(),
      error: (err) => console.error('Error deleting word:', err)
    });
  }

  
}
