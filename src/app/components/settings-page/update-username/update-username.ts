import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../../services/settings/settings-service';

@Component({
  selector: 'app-update-username',
  imports: [ReactiveFormsModule],
  templateUrl: './update-username.html',
  styleUrl: './update-username.scss',
})
export class UpdateUsername {
  usernameForm: FormGroup;
  submitted = false;
  errorMessage = '';
  succesMessage = '';

  constructor(private fb: FormBuilder, private settingsService: SettingsService){
    this.usernameForm = this.fb.group({
      newUsername: ['', Validators.required]
    });
  }

 onSubmit() {
    this.submitted = true;
    if (this.usernameForm.invalid) return;

    const { newUsername } = this.usernameForm.value;
    this.settingsService.updateUsername(newUsername).subscribe({
      next: () => {
        this.usernameForm.reset();
        this.submitted = false;
        this.succesMessage = 'Username updated successfully.';
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