import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import SweetAlert from 'src/app/utils/sweetAlert';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.css']
})
export class AddAddressComponent implements OnInit {
  @Input() userId: string;
  @Output() onClose: EventEmitter<any> = new EventEmitter();
  submitted = false;
  registrationNumber: string;
  env: any = environment;
  currentDateTime: any = this.datePipe.transform(
    new Date(),
    'yyyy-MM-dd h:mm:ss'
  );

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    address: new FormControl(''),
    state: new FormControl(''),
    city: new FormControl(''),
    pincode: new FormControl(''),
    phone: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public apiService: ApiService,
    public router: Router,
    private route: ActivatedRoute,
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    console.log('User ID:', this.userId);
    this.registrationNumber = this.route.snapshot.paramMap.get('reg_no') || '';
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        address: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        pincode: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        insertDateTime: this.currentDateTime,
      },
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
    this.form.value.userId = this.userId;

    const reqBody = JSON.stringify(this.form.value, null, 2);
    console.log('Request Body:', reqBody);
    this.apiService.addAddress(reqBody).subscribe({
      next: (data) => {
        if (data && data.status == 200) {
          SweetAlert.successAlert('Success', 'Address add successful.');
          // this.addressAdded.emit(reqBody);
          this.onClose.emit(data.data);
          this.closeModal();
          this.submitted = false;
          this.form.reset();
        }
      },
      error: (err) => {
        SweetAlert.errorAlert("Error!", err.error.message);
      },
    });
  }

  closeModal(): void {
    this.onClose.emit(); 
  }
}
