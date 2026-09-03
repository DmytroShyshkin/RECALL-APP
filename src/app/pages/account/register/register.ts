import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { createAuthForm } from '../auth-form.factory';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  submitted = false;
  authForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = createAuthForm(this.fb, true);
  }

  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) return;

    const { email, password, username } = this.authForm.value;
    console.log('Submitting:', { email, username });

    this.authService.register(username, email, password).subscribe({
      next: (response) => {
        this.authForm.reset();
        this.submitted = false;
        this.successMessage = `We sent the email to ${response.email}. Confirm your account to log in.`;

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 6000);
      },
      error: (e) => {
        if (e.status === 409) {
          this.errorMessage = e.error.message;
        } else {
          this.errorMessage = 'Something went wrong. Try again.';
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
      }
    })
  }
}