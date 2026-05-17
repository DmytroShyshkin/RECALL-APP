import { Component, ElementRef, HostListener } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../../services/auth';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isLoggedIn$: Observable<boolean>;
  dropdownOpen = false; // Dropdown state

  constructor(private router: Router, private elementRef: ElementRef, private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  // Dropdown
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
  if (!this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
  // ~Dropdown

  goToHome() {
    this.router.navigate(['/']);
  }

  goToLogin() {
  this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.authService.logout();
    this.dropdownOpen = false;
  }
}
