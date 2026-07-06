import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordSummary } from './word-summary';

describe('WordSummary', () => {
  let component: WordSummary;
  let fixture: ComponentFixture<WordSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(WordSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
