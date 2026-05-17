import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmail } from './update-email';

describe('UpdateEmail', () => {
  let component: UpdateEmail;
  let fixture: ComponentFixture<UpdateEmail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmail],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateEmail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
