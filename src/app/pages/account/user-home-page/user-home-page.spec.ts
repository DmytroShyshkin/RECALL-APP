import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserHomePage } from './user-home-page';

describe('UserHomePage', () => {
  let component: UserHomePage;
  let fixture: ComponentFixture<UserHomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHomePage],
    }).compileComponents();

    fixture = TestBed.createComponent(UserHomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
