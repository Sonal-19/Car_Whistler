import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCarWhistlerComponent } from './payment-car-whistler.component';

describe('PaymentCarWhistlerComponent', () => {
  let component: PaymentCarWhistlerComponent;
  let fixture: ComponentFixture<PaymentCarWhistlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentCarWhistlerComponent]
    });
    fixture = TestBed.createComponent(PaymentCarWhistlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
