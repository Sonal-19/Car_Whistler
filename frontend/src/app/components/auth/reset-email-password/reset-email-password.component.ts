import { Component, OnInit } from '@angular/core';
// import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import SweetAlert from 'src/app/utils/sweetAlert';
import { environment } from 'src/environments/environment';
import Validation from 'src/app/utils/validation';

@Component({
  selector: 'app-reset-email-password',
  templateUrl: './reset-email-password.component.html',
  styleUrls: ['./reset-email-password.component.css']
})
export class ResetEmailPasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  submitted = false;
  env: any = environment;
  // currentDateTime: any = this.datePipe.transform(
  //   new Date(),
  //   'yyyy-MM-dd h:mm:ss'
  // );
  email:string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    // public datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      resetOTP: ['', Validators.required],
      newpassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ]
      ],
      newconfirmPassword: ['', Validators.required],
      // insertDateTime: this.currentDateTime,
    },
    {
      Validators: [Validation.match('newpassword', 'newconfirmPassword')],
    }
  );

   // query params
   this.route.queryParams.subscribe(params => {
    this.email = params['email'] || '';
    console.log("Received email from query params:", this.email);
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

  // Create request body
  const resetData = {
    email: this.email,
    resetOTP: this.form.value.resetOTP.trim(),
    newPassword: this.form.value.newpassword,
    newconfirmPassword: this.form.value.newconfirmPassword
  };

  
  this.authService.resetEmailPassword(resetData).subscribe({
    next: (data) => {
      if (data && data.status === 200) {
        SweetAlert.successAlert('Success', 'Password has been reset successfully.');
        this.form.reset();
        this.router.navigate(['login']);
      }
    },
    error: (err) => {
      SweetAlert.errorAlert('Error!', 'Something went wrong!');
    }
  });
}
}


