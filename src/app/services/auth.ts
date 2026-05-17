import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //private apiUrl = 'https://language-learning-api-qe0e.onrender.com';

  private apiUrl = environment.apiUrl;

  // BehaviorSubject хранит текущее значение и отдаёт его новым подписчикам
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  
  // public Observable for components to subscribe to
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(username: string, email: string, password: string) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/auth/register`, { email, password, username });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  get isLoggedInValue(): boolean {
    return this.loggedIn.value;
  }

  getEmailFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email ?? payload.sub ?? null;
    } catch {
      return null;
    }
  }
}