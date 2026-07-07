import { TestBed } from '@angular/core/testing';

import { Minigames } from './minigames';

describe('Minigames', () => {
  let service: Minigames;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Minigames);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
