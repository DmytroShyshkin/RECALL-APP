import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const guestGuard = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedInValue) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};