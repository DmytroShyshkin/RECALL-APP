import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../../services/settings/settings-service';

@Component({
  selector: 'app-update-email',
  imports: [ReactiveFormsModule],
  templateUrl: './update-email.html',
  styleUrl: './update-email.scss',
})
export class UpdateEmail {
  emailForm: FormGroup;
  submitted = false;
  errorMessage = '';
  succesMessage = '';

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.emailForm.invalid) return;

    const { newEmail } = this.emailForm.value;
    this.settingsService.updateEmail(newEmail).subscribe({
      next: () => {
        this.emailForm.reset();
        this.submitted = false;
        this.succesMessage = 'Email updated successfully. Please verify your new email.';
        setTimeout(() => this.succesMessage = '', 4000);
      },
      error: (e) => {
        if (e.status === 409) {
          this.errorMessage = e.error.message;
        } else {
          this.errorMessage = 'Something went wrong. Try again.';
        }
        setTimeout(() => this.errorMessage = '', 4000);
      }
    });
  }
}