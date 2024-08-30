import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import SweetAlert from 'src/app/utils/sweetAlert';

@Component({
  selector: 'app-email-otp-verify',
  templateUrl: './email-otp-verify.component.html',
  styleUrls: ['./email-otp-verify.component.css']
})
export class EmailOtpVerifyComponent implements OnInit {
  submitted = false;
  form: FormGroup = new FormGroup({});
  email: string = '';
  timer: any;
  minutes: number = 2;
  seconds: number = 0;
  otpExpired = false;
  resendOtpEnabled = false;
  // timer: number = 128;
  // resendDisabled: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    // Retrieve the email from query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });

    this.form = this.formBuilder.group({
      otp: ['', Validators.required],
      email: [this.email]
    });

    // this.startTimer();
    this.startOtpTimer();

  }

  // startTimer() {
  //   const interval = setInterval(() => {
  //     this.timer--;
  //     if(this.timer <= 0){
  //       clearInterval(interval);
  //       this.resendDisabled = false;
  //     }
  //   }, 1000);
  // }
  
  startOtpTimer() {
    let timeLeft = 120; // 2 minutes in seconds

    this.timer = setInterval(() => {
      timeLeft--;
      this.minutes = Math.floor(timeLeft / 60);
      this.seconds = timeLeft % 60;

      if (timeLeft <= 0) {
        this.otpExpired = true;
        clearInterval(this.timer);
        this.resendOtpEnabled = true;
      }
    }, 1000);
  }

  get f(): { [key: string]: AbstractControl} {
    return this.form.controls;
  }

  // onSubmit(): void {
  //   this.submitted = true;
    
  //   if(this.form.invalid){
  //     return;
  //   }

  //   const otpValue = this.form.value.otp.trim();
  //   this.authService.verifyOtp({otp: otpValue}).subscribe({
  //     next: (data) => {
        
  //       if(data.status === 200) {
  //         SweetAlert.successAlert('Success', 'Email verified successfully.');
  //         this.router.navigate(['dashboard']);
  //       }
  //     },
  //     error: (err) =>{
  //       SweetAlert.errorAlert('Error!', err.error.message)
  //     }
  //   });
    
  // }


  onSubmit(): void {
    this.submitted = true;
  
    if (this.form.invalid || this.otpExpired) {
      SweetAlert.errorAlert('Error!', 'OTP has expired. Please request a new one.');
      return;
    }
  
    const otpValue = this.form.value.otp.trim();
    this.authService.verifyOtp({ otp: otpValue }).subscribe({
      next: (data) => {
        if (data.status === 200) {
          SweetAlert.successAlert('Success', 'Email verified successfully.');
  
          // Save the token 
          this.authService.saveUser(data); 
  
          this.router.navigate(['dashboard']);
        }
      },
      error: (err) => {
        SweetAlert.errorAlert('Error!', err.error.message);
      }
    });
  }

  resendOtp(): void {
    if (this.resendOtpEnabled) {
      this.authService.resendOtp({ email: this.email }).subscribe({
        next: (data) => {
          SweetAlert.successAlert('Success', 'A new OTP has been sent to your email.');
          this.otpExpired = false;
          this.resendOtpEnabled = false;
          this.startOtpTimer(); // Restart the OTP timer
        },
        error: (err) => {
          SweetAlert.errorAlert('Error!', err.error.message);
        }
      });
    }
  }

}

