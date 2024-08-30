import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetEmailPasswordComponent } from './reset-email-password.component';

describe('ResetEmailPasswordComponent', () => {
  let component: ResetEmailPasswordComponent;
  let fixture: ComponentFixture<ResetEmailPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetEmailPasswordComponent]
    });
    fixture = TestBed.createComponent(ResetEmailPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
