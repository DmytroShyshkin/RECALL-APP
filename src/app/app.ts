import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { AsyncPipe } from '@angular/common';
import { Loading } from './services/loading/loading';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('lenguage-learning-api-web');

  isLoading$: Observable<boolean>;

  constructor(private loadingService: Loading) {
    this.isLoading$ = this.loadingService.isLoading$;
  }
}
