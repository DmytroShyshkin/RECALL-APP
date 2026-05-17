import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../../services/settings/settings-service';

@Component({
  selector: 'app-update-password',
  imports: [ReactiveFormsModule],
  templateUrl: './update-password.html',
  styleUrl: './update-password.scss',
})
export class UpdatePassword {
  passwordForm: FormGroup;
  submitted = false;
  errorMessage = '';
  succesMessage = '';

  constructor(private fb: FormBuilder, private settingsService: SettingsService) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.passwordForm.invalid) return;

    const { oldPassword, newPassword } = this.passwordForm.value;
    this.settingsService.updatePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.passwordForm.reset();
        this.submitted = false;
        this.succesMessage = 'Password updated successfully.';
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