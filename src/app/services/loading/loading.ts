import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Loading {
  private bIsLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.bIsLoading.asObservable();

  show() { 
    setTimeout(() => this.bIsLoading.next(true), 0);
  }

  hide() { 
    setTimeout(() => this.bIsLoading.next(false), 0);
  }
}
