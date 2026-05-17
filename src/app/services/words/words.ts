import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WordsDTO, PageResponse } from '../../models/words/words.model';
import { Observable } from 'rxjs';

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
}
