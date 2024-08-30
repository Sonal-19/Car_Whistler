// import { Component, OnInit } from '@angular/core';
// import { DatePipe } from '@angular/common';
// import {
//   AbstractControl,
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import { ApiService } from 'src/app/services/api.service';
// import { environment } from 'src/environments/environment';
// import { Router } from '@angular/router';
// import Validation from '../../../utils/validation';
// import SweetAlert from 'src/app/utils/sweetAlert';

// @Component({
//   selector: 'app-user-profile',
//   templateUrl: './user-profile.component.html',
//   styleUrls: ['./user-profile.component.css']
// })
// export class UserProfileComponent implements OnInit{
//   submitted = false;
//   env: any = environment;
//   currentDateTime: any = this.datePipe.transform(
//     new Date(),
//     'yyyy-MM-dd h:mm:ss'
//   );

//   form: FormGroup = new FormGroup({
//     fullName: new FormControl(''),
//     email: new FormControl(''),
//     phone: new FormControl(''),
//     password: new FormControl(''),
//     confirmPassword: new FormControl(''),
//   });

//   constructor(
//     private formBuilder: FormBuilder,
//     public datePipe: DatePipe,
//     public apiService: ApiService,
//     public router: Router
//   ) {}

//   ngOnInit(): void {
//     this.form = this.formBuilder.group(
//       {
//         fullName: ['', Validators.required],
//         email: ['', [Validators.required, Validators.email]],
//         phone: ['', [Validators.required, Validators.minLength(10)]],
//         password: [
//           '',
//           [
//             Validators.required,
//             Validators.minLength(6),
//             Validators.maxLength(40),
//           ],
//         ],
//         confirmPassword: ['', Validators.required],
//         insertDateTime: this.currentDateTime,
//       },
//       {
//         validators: [Validation.match('password', 'confirmPassword')],
//       }
//     );
//   }

//   get f(): { [key: string]: AbstractControl } {
//     return this.form.controls;
//   }

//   onSubmit(): void {
//     this.submitted = true;

//     if (this.form.invalid) {
//       return;
//     }

//     const reqBody = JSON.stringify(this.form.value, null, 2);
//     this.apiService.userProfile(reqBody).subscribe({
//       next: data => {
//         if(data && data.status == 1){
//           SweetAlert.successAlert("Success","Account created successfully.");
//           this.submitted = false;
//           this.form.reset();
//           this.router.navigate(['login']);
//         }
//       },
//       error: err => {
//         SweetAlert.errorAlert("Error!", err.error.message);
//         this.submitted = false;
//         this.form.reset();
//       }
//     });
//   }
// }
