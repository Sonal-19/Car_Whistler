import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

declare global {
  interface Window {
    Razorpay: any;
  }
}

@Component({
  selector: 'app-payment-car-whistler',
  templateUrl: './payment-car-whistler.component.html',
  styleUrls: ['./payment-car-whistler.component.css']
})
export class PaymentCarWhistlerComponent implements OnInit {
  transitionId: string | null = null;
  paymentDetails: any = null;
  showLoader: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transitionId = this.route.snapshot.queryParamMap.get('transitionId');

    if (this.transitionId) {
      this.getPaymentDetails(this.transitionId);
    }

    this.loadRazorpayScript();
  }

  getPaymentDetails(transitionId: string): void {
    this.apiService.getProceedToPayment(transitionId).subscribe({
      next: data => {
        if (data.status === 200) {
          this.paymentDetails = data.data;
        } else {
          console.error("Error fetching payment details:", data.message);
        }
      },
      error: err => {
        console.error("Error fetching payment details:", err.error.message);
      }
    });
  }

  loadRazorpayScript(): void {
    if (document.getElementById('razorpay-script')) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.id = 'razorpay-script';
    script.onload = () => console.log('Razorpay script loaded');
    document.body.appendChild(script);
  }

  payNow(): void {
    if (!this.paymentDetails) {
      console.error("Payment details are not available.");
      return;
    }

    this.showLoader = true;

    const orderData = {
      transitionId: this.transitionId,
      amount: this.paymentDetails.amount,
      userId: this.paymentDetails.userId, 
    };

    this.apiService.createOrder(orderData).subscribe({
      next: data => {
        if (data.status === 200) {
          console.log("Order created successfully:", data.data);

          const options: any = {
            key: data.data.payment_info.key, 
            amount: this.paymentDetails.amount, 
            currency: data.data.payment_info.currency,
            name: 'Car Whistler',
            description: 'Payment for your order',
            order_id: data.data.payment_info.order_id, 
            handler: (response: any) => {
              this.handlePaymentSuccess(response);
            },
            prefill: {
              name: this.paymentDetails.username,
              email: this.paymentDetails.email,
              contact: this.paymentDetails.mobile,
            },
            theme: {
              color: '#3399cc'
            },
            modal: {
              ondismiss: () => {
                this.showLoader = false;
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', () => {
            this.showLoader = false;
          });

          rzp.open();
          this.showLoader = false;

        } else {
          console.error("Error creating order:", data.message);
          this.showLoader = false;
        }
      },
      error: err => {
        console.error("Error creating order:", err.error.message);
        this.showLoader = false;
      }
    });
  }

  handlePaymentSuccess(response: any): void {
    console.log('Payment successful', response);

    const paymentResponseData = {
      order_id: response.razorpay_order_id,
    };

    this.apiService.paymentResponse(paymentResponseData).subscribe({
      next: data => {
        if (data.status === 200) {
          console.log("Payment verified successfully:", data.message);
          this.router.navigate(['/dashboard']);
        } else {
          console.error("Error verifying payment:", data.message);
        }
      },
      error: err => {
        console.error("Error verifying payment:", err.error.message);
      }
    });
  }

  
}
