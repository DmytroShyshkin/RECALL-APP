import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { SettingsService } from '../../services/settings/settings-service';
import { Router } from '@angular/router';

import { UpdateEmail } from '../../components/settings-page/update-email/update-email';
import { UpdateUsername } from '../../components/settings-page/update-username/update-username';
import { UpdatePassword } from '../../components/settings-page/update-password/update-password';

@Component({
  selector: 'app-settings',
  imports: [UpdateEmail, UpdateUsername, UpdatePassword],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private apiUrl = 'https://language-learning-api-qe0e.onrender.com';

  constructor(
    private http: HttpClient
    , private authService: AuthService
    , private router: Router
    , private settingsService: SettingsService
  ) {}

  deleteAccount() {
  this.http.delete(`${this.apiUrl}/users/me`).subscribe({
    next: () => {
      this.authService.logout();
    },
    error: (e) => console.error(e)
  });
}

  verifyEmail() {
    this.settingsService.verifyEmail().subscribe({
      next: () => {
        console.log('Email verification sent.');
      },
      error: (e) => console.error('Error sending email verification:', e)
    });
  }
}
