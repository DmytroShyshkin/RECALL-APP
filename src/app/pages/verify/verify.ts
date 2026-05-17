import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify',
  imports: [],
  templateUrl: './verify.html',
  styleUrl: './verify.scss',
})
export class Verify implements OnInit {
  message = 'Verifying...';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];
    this.http.get(`http://localhost:8080/auth/verify?token=${token}`, { responseType: 'text' }).subscribe({
      next: () => {
        this.message = 'Email verified! Redirecting...';
        setTimeout(
          () => this.router.navigate(['/login'])
          , 2000
        );
      },
      error: () => {
        this.message = 'Invalid or expired token.';
      }
    });
  }
}
