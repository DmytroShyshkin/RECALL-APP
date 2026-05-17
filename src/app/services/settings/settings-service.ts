import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private apiUrl = 'https://language-learning-api-qe0e.onrender.com';

  constructor(private http: HttpClient) {}

  updateEmail(newEmail: string) {
    return this.http.put(`${this.apiUrl}/users/me/email`, newEmail);
  }

  verifyEmail() {
    return this.http.post(`${this.apiUrl}/auth/resend-verification`, {});
  }

  updateUsername(newUsername: string) {
    return this.http.put(`${this.apiUrl}/users/me/username`, newUsername);
  }

  updatePassword(oldPassword: string, newPassword: string) {
    return this.http.put(`${this.apiUrl}/users/me/password`, { oldPassword, newPassword });
  }

}
