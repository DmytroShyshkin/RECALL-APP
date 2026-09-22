import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Words } from '../words/words';

@Injectable({
  providedIn: 'root',
})
export class Languages {
  constructor(private wordsService: Words) {}

  /**
   * Every language the user already has in their account — as the source
   * language of a word, or as the target language of one of its
   * translations. Pulled live from their word list rather than a fixed
   * reference table, so the picker only ever offers languages that already
   * exist for this user (e.g. "en", "ua") instead of a generic ISO catalog.
   *
   * Note: reads a single (large) page of words, so an account with more
   * words than `pageSize` won't see languages that only appear further in
   * — good enough for now, worth revisiting with a dedicated backend
   * endpoint if that ever becomes a real limitation.
   */
  getKnownLanguages(): Observable<string[]> {
    return this.wordsService.getWordsByOwner(0, 200).pipe(
      map((page) => {
        const languages = new Set<string>();
        for (const word of page.content) {
          if (word.sourceLanguage) languages.add(word.sourceLanguage);
          for (const translation of word.translations || []) {
            if (translation.targetLanguage) languages.add(translation.targetLanguage);
          }
        }
        return [...languages].sort();
      })
    );
  }
}
