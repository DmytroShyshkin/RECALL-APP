import { Routes } from '@angular/router';
import { guestGuard } from './guards/guest-guard';
import { Login } from './pages/account/login/login';
import { Register } from './pages/account/register/register';
import { Home } from './pages/home/home';
import { Settings } from './pages/settings/settings';
// Minigames
import { AnkiGame } from './components/minigames/anki-game/anki-game';
import { QuizGame } from './components/minigames/quiz-game/quiz-game';
import { Minigames } from './pages/account/minigames/minigames';
// ~Minigames
import { authGuard } from './guards/auth-guard';
import { UserHomePage } from './pages/account/user-home-page/user-home-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { Verify } from './pages/verify/verify';

export const routes: Routes = [
    {
        path: ''
        , component: Home
    },
    {
        path: 'login'
        , component: Login
        , canActivate: [authGuard]
    },
    {
        path: 'register'
        , component: Register
        , canActivate: [authGuard]
    },
    {
        path: 'profile'
        , component: UserHomePage
        , canActivate: [guestGuard]
    },
    {
        path: 'settings'
        , component: Settings
        , canActivate: [guestGuard]
    },
    { 
        path: 'verify-email'
        ,component: Verify
    },
    {
        path: 'minigames'
        , component: Minigames
        , canActivate: [guestGuard]
    },
    {
        path: 'anki'
        , component: AnkiGame
        , canActivate: [guestGuard]
    },
    {
        path: 'quiz'
        , component: QuizGame
        , canActivate: [guestGuard]
    },
    {
        path: '**'
        , component: NotFoundPage
    }
];
