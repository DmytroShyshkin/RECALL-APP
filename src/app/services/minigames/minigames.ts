import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class Minigames {
  private _exitCallback: (() => void) | null = null; // Callback function to be called when exiting the minigame
  //private apiMiniGamesUrl = 'https://recall-quiz-microservice.onrender.com/';
  private apiMiniGamesUrl = environment.apiMiniGamesUrl;


  constructor(private http: HttpClient) {}

  // AnkiController
  initializeAnkiGame(data: {sourceLanguage: string, targetLanguage: string}) {
    return this.http.post(`${this.apiMiniGamesUrl}/anki/initiate`, data);
  }

  nextAnkiCard(){
    return this.http.get(`${this.apiMiniGamesUrl}/anki/next`);
  }

  reviewAnkiCard(id: string, rating: number){
    return this.http.post(`${this.apiMiniGamesUrl}/anki/${id}/review`, { rating });
  }
  // ~AnkiController

  // QuizController
  startQuiz(data: {languages: string[], wordCount: number}) {
    return this.http.post(`${this.apiMiniGamesUrl}/quiz/start`, data);
  }

  answerQuizQuestion(sessionId: string, answer: string) {
  return this.http.post(`${this.apiMiniGamesUrl}/quiz/${sessionId}/answer`, { userAnswer: answer });
}

  getQuizResult(sessionId: string) {
    return this.http.get(`${this.apiMiniGamesUrl}/quiz/${sessionId}/result`);
  }

  deleteQuizSession(sessionId: string) {
    return this.http.delete(`${this.apiMiniGamesUrl}/quiz/${sessionId}/deleteSession`);
  }
  // ~QuizController

  // Callback registration for exiting the minigame
  registerExitCallback(cb: () => void) {
    this._exitCallback = cb;
  }

  exitToMainPage() {
    if (this._exitCallback) {
      this._exitCallback();
    }
  }
  // ~Callback registration for exiting the minigame
}
