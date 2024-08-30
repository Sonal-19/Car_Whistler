import { Component, OnInit} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import Validation from '../../../utils/validation';
import SweetAlert from 'src/app/utils/sweetAlert';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  submitted = false;
  userId: string;
  env: any = environment;

 image: string | ArrayBuffer | null = null;

  currentDateTime: any = this.datePipe.transform(
    new Date(),
    'yyyy-MM-dd h:mm:ss'
  );

  showPassword = false;
  showConfirmPassword = false;

  form: FormGroup = new FormGroup({
    fullName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    image: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    console.log('User ID:', this.userId);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(10)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        confirmPassword: ['', Validators.required],
        image:[''],
        insertDateTime: this.currentDateTime,
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );

    this.apiService.getUserProfile(this.userId).subscribe({
      next: (data) => {
        console.log('User Data:', data);
        this.form.patchValue(data.data);
        this.image = data.data.image;
      },
      error: (err) => {
        SweetAlert.errorAlert('Error!', err.error.message);
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  togglePasswordVisibility(): void {

    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

   this.apiService.updateUserProfile(this.userId, this.form.value).subscribe({
      next: () => {
        SweetAlert.successAlert("Success", "Profile updated successfully.");
        this.router.navigate(['profile', this.userId]);
      },
      error: (err) => {
        SweetAlert.errorAlert("Error!", err.error.message);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
