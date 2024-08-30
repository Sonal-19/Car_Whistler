import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import SweetAlert from 'src/app/utils/sweetAlert';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {
  submitted = false;
  userId: string;
  addressId: string;
  currentDateTime: any = this.datePipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss');
  form: FormGroup;

  @Output() onClose = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    public apiService: ApiService,
    private modalRef: BsModalRef
  ) {
    this.userId = this.modalRef?.content?.userId || '';
    this.addressId = this.modalRef?.content?.addressId || '';
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      insertDateTime: this.currentDateTime,
    });
  }

  ngOnInit(): void {
    this.getAddressDetails();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getAddressDetails(): void {
    this.apiService.getAddress(this.userId).subscribe({
      next: (data) => {
        const address = data.data.find((addr: any) => addr._id === this.addressId);
        if (address) {
          this.form.patchValue(address);
        }
      },
      error: (err) => {
        console.error("Error!", err.error.message);
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const reqBody = {
      addressId: this.addressId,
      ...this.form.value,
      insertDateTime: this.currentDateTime,
    };

    this.apiService.updateAddress(this.addressId, reqBody).subscribe({
      next: (data) => {
        if (data && data.status === 200) {
          SweetAlert.successAlert('Success', 'Address updated successfully.');
          this.onClose.emit(this.form.value);
          this.onClose.emit(data.data);
          this.onCloseModal();
          this.submitted = false;
          this.form.reset();
        }
      },
      error: (err) => {
        SweetAlert.errorAlert("Error!", err.error.message);
      },
    });
  }

  onCloseModal(): void {
    this.onClose.emit(); 
  }
}
