import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWordDialoge } from './update-word-dialoge';

describe('UpdateWordDialoge', () => {
  let component: UpdateWordDialoge;
  let fixture: ComponentFixture<UpdateWordDialoge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateWordDialoge],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateWordDialoge);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
