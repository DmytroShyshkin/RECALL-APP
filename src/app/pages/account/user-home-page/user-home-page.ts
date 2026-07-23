import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../../../services/users/users';
import { WordCard } from '../../../components/words/word-card/word-card';

type UserData = {
  username: string;
  email: string;
}

@Component({
  selector: 'app-user-home-page',
  imports: [WordCard],
  templateUrl: './user-home-page.html',
  styleUrl: './user-home-page.scss',
})
export class UserHomePage implements OnInit{
  constructor(private router: Router,private usersService: Users) {}

  userData: UserData | null = null;

  ngOnInit() {
    this.usersService.getUserInfo().subscribe({
    next: (data) => {
      this.userData = { username: data.username, email: data.email };
    },
      error: (err) => {
      console.error('Could not load user info', err);
    }
    });
  }

  openMinigames() {
    this.router.navigate(['/minigames']);
  }
}