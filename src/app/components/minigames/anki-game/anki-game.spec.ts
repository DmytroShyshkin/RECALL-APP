import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnkiGame } from './anki-game';

describe('AnkiGame', () => {
  let component: AnkiGame;
  let fixture: ComponentFixture<AnkiGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnkiGame],
    }).compileComponents();

    fixture = TestBed.createComponent(AnkiGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
