import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUsername } from './update-username';

describe('UpdateUsername', () => {
  let component: UpdateUsername;
  let fixture: ComponentFixture<UpdateUsername>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUsername],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateUsername);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
