import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WordsDTO, PageResponse, WordStatisticsDTO, UserStatsSummaryDTO } from '../../models/words/words.model';
import { Observable } from 'rxjs';
import { TranslationDTO } from '../../models/translations/translations.model';

@Injectable({
  providedIn: 'root',
})

export class Words {
  private apiUrl = 'https://language-learning-api-qe0e.onrender.com';

  constructor(private http: HttpClient) {}

  // WordController
  getWordsByOwner(pageNo: number, pageSize: number): Observable<PageResponse<WordsDTO>> {
    const params = new HttpParams()
      .set('pageNo', pageNo)
      .set('pageSize', pageSize);

    return this.http.get<PageResponse<WordsDTO>>(`${this.apiUrl}/words/user`, { params });
  }

  createWord(data: { sourceLanguage: string; originalWord: string; translations?: TranslationDTO[] | null }) {
    return this.http.post(`${this.apiUrl}/words`, data);
  }

  updateWord(wordId: string, data: { originalWord: string; sourceLanguage: string }) {
    return this.http.put(`${this.apiUrl}/words/update-word/${wordId}`, data);
  }

  deleteWord(wordId: string) {
    return this.http.delete(`${this.apiUrl}/words/delete-word/${wordId}`);
  }
  // ~WordController
  // TranslationController

  updateTranslation(wordId: string, translationId: string, data: TranslationDTO) {
    return this.http.put(`${this.apiUrl}/words/${wordId}/translations/${translationId}`, data);
  }

  addTranslation(wordId: string, data: TranslationDTO) {
    return this.http.post(`${this.apiUrl}/words/${wordId}/translations`, data);
  }
  
  deleteTranslation(wordId: string, translationId: string) {
    return this.http.delete(`${this.apiUrl}/words/${wordId}/translations/${translationId}`);
  }
  // ~TranslationController
  // WordStatisticsController
  getWordStatistics(){
    return this.http.get<WordStatisticsDTO[]>(`${this.apiUrl}/statistics/words`);
  }

  getUserStatsSummary(){
    return this.http.get<UserStatsSummaryDTO>(`${this.apiUrl}/statistics/summary`);
  }
  // ~WordStatisticsController
}
