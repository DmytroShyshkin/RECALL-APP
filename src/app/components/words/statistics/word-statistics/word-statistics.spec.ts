import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordStatistics } from './word-statistics';

describe('WordStatistics', () => {
  let component: WordStatistics;
  let fixture: ComponentFixture<WordStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(WordStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
