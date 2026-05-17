import { TestBed } from '@angular/core/testing';

import { Translations } from './translations';

describe('Translations', () => {
  let service: Translations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Translations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
