import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import SweetAlert from 'src/app/utils/sweetAlert';
import { StorageService } from 'src/app/services/storage.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddAddressComponent } from '../add-address/add-address.component';
import { AddressComponent } from '../address/address.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})

export class OrderComponent implements OnInit {
  @ViewChild('addAddress') addAddress!: TemplateRef<any>;
  @ViewChild('addressModal') addressModal!: TemplateRef<any>;
  modalRef?: BsModalRef;
  submitted = false;
  userId?: string;
  currentDateTime: string;
  deliveryDetails: any = null;
  deliveryDate: Date | null = null;
  vehicleDetails: any = {};
  addresses: any = [];
  selectedAddress: any = null;
  deliveryChecked = false;
  sticker_charge = 0;

  form: FormGroup;
  isLoading = false;
  addressAdded = false;
  isPincodeChecked = false;

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private modalService: BsModalService
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    if (!this.userId) {
      const user = this.storageService.getUser();
      this.userId = user ? user.userId : '';
    }
    this.currentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss') || '';
    this.form = this.formBuilder.group({
      registrationNumber: ['', Validators.required],
      phone: ['', Validators.required],
      pincode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const vehicleId = params['vehicleId'];
      if (vehicleId) {
        this.getVehicleDetailsById(vehicleId);
      }
    });
    this.getAddress();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onPincodeInput(): void {
    this.deliveryDetails = null;
  }

  checkDeliveryDetails(): void {
    const pincode = this.form.value.pincode;
    if (!pincode) {
      SweetAlert.errorAlert("Error!", "Pincode is required.");
      return;
    }
    this.apiService.getDeliveryCharges(pincode).subscribe({
      next: data => {
        if (data.status === 200) {
          this.deliveryDetails = data.data;
          this.calculateDeliveryDate();
          this.deliveryChecked = true;
        } else {
          SweetAlert.errorAlert("Error!", data.message);
          this.deliveryChecked = false;
        }
      },
      error: err => {
        SweetAlert.errorAlert("Error!", err.error.message);
        this.deliveryChecked = false;
      }
    });
  }

  calculateDeliveryDate(): void {
    const currentDate = new Date();
    this.deliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
  }

  getVehicleDetailsById(vehicleId: string): void {
    this.apiService.getVehicleDetailsById(vehicleId).subscribe({
      next: data => {
        if (data && data.status === 200) {
          this.vehicleDetails = data.data;
        } else {
          SweetAlert.errorAlert("Error!", data.message);
        }
      },
      error: err => {
        SweetAlert.errorAlert("Error!", err.error.message);
      }
    });
  }

  openAddAddressModal() {
    if (!this.deliveryChecked) {
      SweetAlert.errorAlert("Error!", "Please check delivery availability before adding an address.");
      return;
    }

    const initialState = { userId: this.userId };
    const modalRef = this.modalService.show(AddAddressComponent, { initialState });

    if (modalRef.content) {
      modalRef.content.onClose.subscribe((newAddress: any) => {
        this.onAddressAdded(newAddress);
        this.getAddress();
        modalRef.hide();
      });
    }
  }

  onAddressAdded(newAddress: any): void {
    this.addresses.push(newAddress);
    this.selectedAddress = newAddress;
    this.addressAdded = true;
  }

  getAddress(): void {
    if (!this.userId) {
      SweetAlert.errorAlert("Error!", "User ID is required.");
      return;
    }
    this.apiService.getUserAddress(this.userId).subscribe({
      next: (data) => {
        if (data && data.status == 200) {
          this.addresses = data.data;
          this.selectedAddress = this.addresses[0] || null;
          this.addressAdded = this.addresses && this.addresses.length > 0;
        } else {
          this.addresses = [];
          this.addressAdded = false;
        }
      },
      error: (err) => {
        SweetAlert.errorAlert("Error!", err.error.message);
        this.addresses = [];
        this.addressAdded = false;
      },
    });
  }

  ChangeAddress(): void {
    if (!this.deliveryChecked) {
      SweetAlert.errorAlert("Error!", "Please check delivery availability before changing address.");
      return;
    }

    const initialState = { userId: this.userId };
    this.modalRef = this.modalService.show(AddressComponent, { initialState });

    this.modalRef.content.onClose.subscribe((updatedAddress: any) => {
      this.selectedAddress = updatedAddress;
      this.modalRef?.hide();
    });
  }

  openAddressModal(): void {
    if (!this.deliveryChecked) {
      SweetAlert.errorAlert("Error!", "Please check delivery availability before selecting address.");
      return;
    }
    const initialState = { userId: this.userId };
    this.modalRef = this.modalService.show(AddressComponent, { initialState });

    this.modalRef.content.onClose.subscribe((selectedAddress: any) => {
      this.selectedAddress = selectedAddress;
      this.modalRef?.hide();
    });
  }

  onAddressSelected(selectedAddress: any): void {
    this.addresses[0] = selectedAddress;
    this.modalRef?.hide();
  }

  displaySelectedAddress(): void {
    return this.selectedAddress ? this.selectedAddress : { name: 'No Address Selected' };
  }

  proceedToPayment(): void {
    if (!this.deliveryChecked) {
      SweetAlert.errorAlert("Error!", "Please check delivery availability before proceeding to payment.");
      return;
    }

    if (!this.addressAdded) {
      SweetAlert.errorAlert("Error!", "Please add an address before proceeding to payment.");
      return;
    }

    if (this.deliveryDetails.pincode !== this.selectedAddress.pincode) {
      SweetAlert.errorAlert("Error!", "Delivery pincode and selected address pincode do not match.");
      return;
    }

    const reqBody = {
      userId: this.userId,
      vehicleId: this.vehicleDetails._id,
      addressId: this.selectedAddress._id,
      addressDetail: this.selectedAddress,
      delivery_charge: this.deliveryDetails.delivery_charge,
      sticker_charge: this.sticker_charge,
      insertDateTime: this.currentDateTime
    };

    this.apiService.proceedToPayment(reqBody).subscribe({
      next: (data) => {
        if (data && data.status === 200) {
          SweetAlert.successAlert("Success", "Proceeding to payment.");
          this.router.navigate(['paymentCarWhistler'], { queryParams: { transitionId: data.data.transitionId } });
        } else {
          SweetAlert.errorAlert("Error!", data.message);
        }
      },
      error: (err) => {
        SweetAlert.errorAlert("Error!", err.error.message);
      },
    });
  }


  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

}
