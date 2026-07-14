import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizGame } from './quiz-game';

describe('QuizGame', () => {
  let component: QuizGame;
  let fixture: ComponentFixture<QuizGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizGame],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
