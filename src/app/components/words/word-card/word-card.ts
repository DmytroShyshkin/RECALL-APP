import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TranslationDTO } from '../../../models/translations/translations.model';
import { PageResponse, WordsDTO } from '../../../models/words/words.model';
import { Words } from '../../../services/words/words';
import { Languages } from '../../../services/languages/languages';
import { LanguagePicker } from '../../shared/language-picker/language-picker';

@Component({
  selector: 'app-word-card',
  imports: [FormsModule, ReactiveFormsModule, LanguagePicker],
  templateUrl: './word-card.html',
  styleUrl: './word-card.scss',
})
export class WordCard implements OnInit {
  pageResponse: PageResponse<WordsDTO> | null = null;
  pageNo = 0;
  pageSize = 50;
  searchQuery = '';
  selectedLanguage = '';
  knownLanguages: string[] = [];

  isModalOpen = false;
  isAddModalOpen = false;
  selectedWord: WordsDTO | null = null;
  editForm: FormGroup;
  addWordForm: FormGroup;
  selectedSynonymId = '';
  addWordSynonymIds: string[] = [];
  selectedAddSynonymId = '';

  constructor(private wordsService: Words, private languagesService: Languages, private fb: FormBuilder) {
    this.editForm = this.fb.group({
      originalWord: [''],
      sourceLanguage: ['']
    });
    this.addWordForm = this.fb.group({
      originalWord: ['', Validators.required],
      sourceLanguage: ['', Validators.required],
      translations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadWords();
    this.loadKnownLanguages();
  }

  loadKnownLanguages(): void {
    this.languagesService.getKnownLanguages().subscribe({
      next: (languages) => this.knownLanguages = languages,
      error: (err) => console.error('Error loading known languages:', err),
    });
  }

  // getKnownLanguages() only looks at the first 200 words (see its own
  // comment), so a language that's already saved on the word being edited
  // can be missing from `knownLanguages` if that word falls outside that
  // page. Without this, the language-picker would show "No matches" for a
  // language the word already legitimately uses. This just supplements the
  // list locally with whatever this specific word already has — it's
  // overwritten by the next real loadKnownLanguages() call anyway.
  private ensureKnownLanguages(word: WordsDTO): void {
    const languages = new Set(this.knownLanguages);
    let changed = false;

    if (word.sourceLanguage && !languages.has(word.sourceLanguage)) {
      languages.add(word.sourceLanguage);
      changed = true;
    }
    for (const t of word.translations || []) {
      if (t.targetLanguage && !languages.has(t.targetLanguage)) {
        languages.add(t.targetLanguage);
        changed = true;
      }
    }

    if (changed) this.knownLanguages = [...languages].sort();
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
    this.ensureKnownLanguages(word);

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

    this.selectedSynonymId = '';
    this.isModalOpen = true;
  }

  closeEdit() {
    this.isModalOpen = false;
    this.selectedWord = null;
    this.selectedSynonymId = '';
  }

  onSave() {
    if (!this.selectedWord) return;

    const { originalWord, sourceLanguage, translations } = this.editForm.value;

    const wordChanged = originalWord !== this.selectedWord.originalWord
      || sourceLanguage !== this.selectedWord.sourceLanguage;

    const originalTranslations = this.selectedWord.translations || [];

    // Every save request we need to fire, collected up front so we can wait
    // for all of them (forkJoin) instead of guessing how long they'll take.
    // The previous version reloaded the word list after a fixed 300ms
    // regardless of whether the requests had actually finished — on a slow
    // or cold-starting backend that reload would run *before* the save
    // completed, so the modal closed showing the old, unsaved data even
    // though the request may well have succeeded moments later.
    const requests: Observable<unknown>[] = [];

    if (wordChanged) {
      requests.push(
        this.wordsService.updateWord(this.selectedWord.id, { originalWord, sourceLanguage }).pipe(
          catchError(err => { console.error('Error updating word:', err); return of(null); })
        )
      );
    }

    translations.forEach((t: TranslationDTO) => {
      if (!t.id) {
        // Skip translation rows that were added with "+ Add Translation"
        // but never actually filled in.
        if (!t.translatedWord) return;

        requests.push(
          this.wordsService.addTranslation(this.selectedWord!.id, t).pipe(
            catchError(err => { console.error('Error adding translation:', err); return of(null); })
          )
        );
      } else {
        const original = originalTranslations.find(ot => ot.id === t.id);
        if (!original) return;

        const changed = t.translatedWord !== original.translatedWord
          || t.targetLanguage !== original.targetLanguage
          || t.description !== original.description;

        if (changed) {
          requests.push(
            this.wordsService.updateTranslation(this.selectedWord!.id, t.id, t).pipe(
              catchError(err => { console.error('Error updating translation:', err); return of(null); })
            )
          );
        }
      }
    });

    const finish = () => {
      this.loadWords();
      this.loadKnownLanguages();
      this.closeEdit();
    };

    if (requests.length === 0) {
      finish();
      return;
    }

    forkJoin(requests).subscribe({ next: finish, error: finish });
  }

  deleteWord(wordId: string) {
    this.wordsService.deleteWord(wordId).subscribe({
      next: () => this.loadWords(),
      error: (err) => console.error('Error deleting word:', err)
    });
  }

  addTranslation() {
    this.translationsArray.push(this.fb.group({
      id: [null],
      targetLanguage: [''],
      translatedWord: [''],
      description: [null]
    }));
  }

  removeTranslation(index: number) {
    const translation = this.translationsArray.at(index).value;

    if (translation.id) {
      this.wordsService.deleteTranslation(this.selectedWord!.id, translation.id)
        .subscribe({ error: (err) => console.error(err) });
    }

    this.translationsArray.removeAt(index);
  }

  // Resolves a synonym id (from WordsDTO.synonymIds) to the actual word,
  // so we can show its text instead of a bare UUID.
  getSynonymWord(synonymId: string): WordsDTO | undefined {
    return this.pageResponse?.content.find(w => w.id === synonymId);
  }

  // Words that can still be added as a synonym of the word being edited:
  // everything except itself and words that are already linked.
  get availableSynonymCandidates(): WordsDTO[] {
    if (!this.selectedWord || !this.pageResponse) return [];
    return this.pageResponse.content.filter(w =>
      w.id !== this.selectedWord!.id &&
      !this.selectedWord!.synonymIds?.includes(w.id)
    );
  }

  addSynonymToSelected() {
    if (!this.selectedWord || !this.selectedSynonymId) return;

    const wordId = this.selectedWord.id;
    const synonymId = this.selectedSynonymId;

    this.wordsService.addSynonym(wordId, synonymId).subscribe({
      next: () => {
        this.selectedWord!.synonymIds = [...(this.selectedWord!.synonymIds || []), synonymId];
        this.selectedSynonymId = '';
      },
      error: (err) => console.error('Error adding synonym:', err)
    });
  }

  removeSynonymFromSelected(synonymId: string) {
    if (!this.selectedWord) return;

    const wordId = this.selectedWord.id;

    this.wordsService.removeSynonym(wordId, synonymId).subscribe({
      next: () => {
        this.selectedWord!.synonymIds = (this.selectedWord!.synonymIds || []).filter(id => id !== synonymId);
      },
      error: (err) => console.error('Error removing synonym:', err)
    });
  }

  openAddWord() {
    this.addWordForm = this.fb.group({
      originalWord: ['', Validators.required],
      sourceLanguage: ['', Validators.required],
      translations: this.fb.array([])
    });
    this.addWordSynonymIds = [];
    this.selectedAddSynonymId = '';
    this.isAddModalOpen = true;
  }

  closeAddWord() {
    this.isAddModalOpen = false;
    this.addWordSynonymIds = [];
    this.selectedAddSynonymId = '';
  }

  // Words that can be picked as a synonym of the word being created.
  // The new word has no id yet, so we only need to exclude what's already picked.
  get availableAddSynonymCandidates(): WordsDTO[] {
    if (!this.pageResponse) return [];
    return this.pageResponse.content.filter(w => !this.addWordSynonymIds.includes(w.id));
  }

  addSynonymToNewWord() {
    if (!this.selectedAddSynonymId) return;
    this.addWordSynonymIds = [...this.addWordSynonymIds, this.selectedAddSynonymId];
    this.selectedAddSynonymId = '';
  }

  removeSynonymFromNewWord(synonymId: string) {
    this.addWordSynonymIds = this.addWordSynonymIds.filter(id => id !== synonymId);
  }

  onAddWord() {
    if (this.addWordForm.invalid) return;
    const { originalWord, sourceLanguage, translations } = this.addWordForm.value;

    this.wordsService.createWord({ originalWord, sourceLanguage }).subscribe({
      next: (word: any) => {
        const pendingTranslations = (translations || []).filter((t: any) => t.translatedWord);
        const pendingSynonymIds = this.addWordSynonymIds;

        if (pendingTranslations.length === 0 && pendingSynonymIds.length === 0) {
          this.loadWords();
          this.loadKnownLanguages();
          this.closeAddWord();
          return;
        }

        const translationRequests = pendingTranslations.map((t: any) =>
          this.wordsService.addTranslation(word.id, t).pipe(
            catchError(err => { console.error(err); return of(null); })
          )
        );

        const synonymRequests = pendingSynonymIds.map(id =>
          this.wordsService.addSynonym(word.id, id).pipe(
            catchError(err => { console.error(err); return of(null); })
          )
        );

        const allRequests = [...translationRequests, ...synonymRequests];

        forkJoin(allRequests).subscribe({
          next: () => {
            this.loadWords();
            this.loadKnownLanguages();
            this.closeAddWord();
          }
        })
      },
      error: (err) => console.error(err)
    });
  }

  addNewTranslation() {
    this.addTranslationsArray.push(this.fb.group({
    targetLanguage: [''],
    translatedWord: [''],
    description: [null]
  }));
  }

  removeNewTranslation(index: number) {
    this.addTranslationsArray.removeAt(index);
  }

  get addTranslationsArray(): FormArray {
    return this.addWordForm.get('translations') as FormArray;
  }

  // Utility functions to generate consistent colors based on language
  getLanguageColor(lang: string): string {
    let hash = 0;
    for (let i = 0; i < lang.length; i++) {
      hash = lang.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 60%, 70%)`;
  }

  getLanguageBg(lang: string): string {
    let hash = 0;
    for (let i = 0; i < lang.length; i++) {
      hash = lang.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return `hsla(${h}, 60%, 40%, 0.15)`;
  }
}