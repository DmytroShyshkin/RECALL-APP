import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WordsDTO, PageResponse } from '../../models/words/words.model';
import { Observable } from 'rxjs';
import { TranslationDTO } from '../../models/translations/translations.model';

@Injectable({
  providedIn: 'root',
})

export class Words {
  private apiUrl = 'https://language-learning-api-qe0e.onrender.com';

  constructor(private http: HttpClient) {}

  getWordsByOwner(pageNo: number, pageSize: number): Observable<PageResponse<WordsDTO>> {
    const params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize);

    return this.http.get<PageResponse<WordsDTO>>(`${this.apiUrl}/words/user`, { params });
  }

  updateWord(wordId: string, data: { originalWord: string; sourceLanguage: string }) {
    return this.http.put(`${this.apiUrl}/words/update-word/${wordId}`, data);
  }

  updateTranslation(wordId: string, translationId: string, data: TranslationDTO) {
    return this.http.put(`${this.apiUrl}/words/${wordId}/translations/${translationId}`, data);
  }

  deleteWord(wordId: string) {
    return this.http.delete(`${this.apiUrl}/words/delete-word/${wordId}`);
  }

  deleteTranslation(wordId: string, translationId: string) {
    return this.http.delete(`${this.apiUrl}/words/${wordId}/translations/${translationId}`);
  }
}
