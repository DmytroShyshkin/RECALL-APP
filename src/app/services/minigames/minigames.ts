import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class Minigames {
  //private apiMiniGamesUrl = 'https://recall-quiz-microservice.onrender.com/';
  private apiMiniGamesUrl = environment.apiMiniGamesUrl;


  constructor(private http: HttpClient) {}

  // AnkiController
  initializeAnkiGame(data: {sourceLanguage: string, targetLanguage: string}) {
    return this.http.post(`${this.apiMiniGamesUrl}anki/initiate`, data);
  }

  nextAnkiCard(){
    return this.http.get(`${this.apiMiniGamesUrl}anki/next`);
  }

  reviewAnkiCard(id: string, rating: number){
    return this.http.post(`${this.apiMiniGamesUrl}anki/${id}/review`, { rating });
  }
  // ~AnkiController

  // QuizController
  startQuiz(data: {language: string[], wordCount: number}) {
    return this.http.post(`${this.apiMiniGamesUrl}/quiz/start`, data);
  }

  answerQuizQuestion(sessionId: string, answer: string) {
    return this.http.post(`${this.apiMiniGamesUrl}/quiz/${sessionId}/answer`, answer);
  }

  getQuizResult(sessionId: string) {
    return this.http.get(`${this.apiMiniGamesUrl}/quiz/${sessionId}/result`);
  }
  // ~QuizController
}
