import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCard } from './word-card';

describe('WordCard', () => {
  let component: WordCard;
  let fixture: ComponentFixture<WordCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordCard],
    }).compileComponents();

    fixture = TestBed.createComponent(WordCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
