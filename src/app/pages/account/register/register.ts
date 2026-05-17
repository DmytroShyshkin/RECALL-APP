import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createAuthForm } from '../auth-form.factory';
import { AuthService } from '../../../services/auth';

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
        console.log('Success:', response);
        this.authForm.reset();
        this.authService.setToken(response.accessToken);
        this.router.navigate(['/']);
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