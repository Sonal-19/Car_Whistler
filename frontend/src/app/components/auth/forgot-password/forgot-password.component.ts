import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import SweetAlert from 'src/app/utils/sweetAlert';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    this.authService.forgotPassword(this.form.value).subscribe({
      next: (data) => {
        if (data && data.status === 200) {
          SweetAlert.successAlert('Success', 'Check your email for OTP.');
          console.log("Form value before navigation:", this.form.value);
          // this.form.reset();
          console.log("Navigating with email:", this.form.value.email);
          // this.router.navigate(['resetEmailPassword'], {queryParams: {email: this.form.value.email} });
          this.router.navigate(['resetEmailPassword'], { queryParams: { email: this.form.value.email } });
          console.log("Navigating with email:", this.form.value.email);

        }
      },
      error: (err) => {
        SweetAlert.errorAlert('Error!', 'Something went wrong!');
      }
    });
  }
}
