import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private apiUrl = 'https://language-learning-api-qe0e.onrender.com';
  
    private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
    isLoggedIn$ = this.loggedIn.asObservable();

    constructor(private http: HttpClient, private router: Router) {}

    getUserInfo() {
      return this.http.get<{ username: string; email: string }>(`${this.apiUrl}/users/me`);
    }
}
