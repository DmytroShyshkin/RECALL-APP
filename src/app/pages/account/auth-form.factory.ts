import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export function createAuthForm(fb: FormBuilder, includeUsername = true): FormGroup {
  return fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    ...(includeUsername && { username: ['', Validators.required] })
  });
}