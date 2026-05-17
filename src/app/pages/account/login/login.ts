import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createAuthForm } from '../auth-form.factory';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  submitted = false;
  authForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = createAuthForm(this.fb, false);
  }

  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) return;

    const { email, password } = this.authForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authForm.reset();
        this.errorMessage = '';
        this.authService.setToken(response.accessToken);
        this.router.navigate(['/']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else if (err.status === 404) {
          this.errorMessage = 'Account not found.';
        } else {
          this.errorMessage = 'Something went wrong. Try again.';
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }
}
