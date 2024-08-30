import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Validation from '../../../utils/validation';
import SweetAlert from 'src/app/utils/sweetAlert';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  submitted = false;
  env: any = environment;
  currentDateTime: any = this.datePipe.transform(
    new Date(),
    'yyyy-MM-dd h:mm:ss'
  );

  form: FormGroup = new FormGroup({
    fullName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
        insertDateTime: this.currentDateTime,
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.form.value.insertDateTime = this.currentDateTime;
    const reqBody = JSON.stringify(this.form.value, null, 2);
    this.authService.register(reqBody).subscribe({
      next: (data) => {
        if (data && data.status == 200) {
          SweetAlert.successAlert('Success', 'Registration successful. Check your email for OTP.');
          this.submitted = false;
          const email = this.form.value.email;
          this.form.reset();
          // this.router.navigate(['login']);
          // this.router.navigate(['email-otp-verify']);
          this.router.navigate(['email-otp-verify'], { queryParams: { email: email } }); 
        }
      },
      error: (err) => {
        if (
          err.error.message &&
          err.error.message.code &&
          err.error.message.code == 11000
        ) {
          if (err.error.message.keyPattern.email) {
            SweetAlert.errorAlert('Error!', 'Email already exist!');
          } else if (err.error.message.keyPattern.phone) {
            SweetAlert.errorAlert('Error!', 'Phone already exist!');
          }
        } else {
          SweetAlert.errorAlert('Error!', 'Something wnt wrong!');
        }
      },
    });
  }
}
