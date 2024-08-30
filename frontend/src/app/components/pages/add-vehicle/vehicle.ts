// import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
// import { DatePipe } from '@angular/common';
// import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ApiService } from 'src/app/services/api.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import SweetAlert from 'src/app/utils/sweetAlert';
// import { StorageService } from 'src/app/services/storage.service';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
// import { AddAddressComponent } from '../add-address/add-address.component';
// import { AddressComponent } from '../address/address.component';

// @Component({
//   selector: 'app-add-vehicle',
//   templateUrl: './add-vehicle.component.html',
//   styleUrls: ['./add-vehicle.component.css']
// })
// export class AddVehicleComponent implements OnInit {
//   @ViewChild('addAddress') addAddress!: TemplateRef<any>;
//   @ViewChild('addressModal') addressModal!: TemplateRef<any>;
//   modalRef?: BsModalRef;
//   submitted = false;
//   userId?: string;
//   currentDateTime: string;
//   deliveryDetails: any = null;
//   deliveryDate: Date | null = null;
//   vehicleDetails: any;
//   addresses: any;
//   selectedAddress: any = null;
//   deliveryChecked = false;
//   vehicleAdded = false;
//   vehicleInfo = false;
  
//   form: FormGroup;
//   isLoading = false;
//   addressAdded = false;
//   isPincodeChecked = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private datePipe: DatePipe,
//     private apiService: ApiService,
//     private router: Router,
//     private route: ActivatedRoute,
//     private storageService: StorageService,
//     private modalService: BsModalService
//   ) {
//     this.userId = this.route.snapshot.paramMap.get('userId') || '';
//     if (!this.userId) {
//       const user = this.storageService.getUser();
//       this.userId = user ? user.userId : '';
//     }
//     this.currentDateTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss') || '';
//     this.form = this.formBuilder.group({
//       registrationNumber: ['', Validators.required],
//       phone: ['', Validators.required],
//       pincode: ['', Validators.required]
//     });
//   }

//   ngOnInit(): void {
//     this.getSavedDeliveryDetails();
//     this.getAddress();
//   }

//   get f(): { [key: string]: AbstractControl } {
//     return this.form.controls;
//   }

//   onPincodeInput(): void {
//     this.deliveryDetails = null;
//   }

//   checkDeliveryDetails(): void {
//     const pincode = this.form.value.pincode;
//     if (!pincode) {
//       SweetAlert.errorAlert("Error!", "Pincode is required.");
//       return;
//     }
//     this.apiService.getDeliveryCharges(pincode).subscribe({
//       next: data => {
//         if (data.status === 200) {
//           this.deliveryDetails = data.data;
//           this.calculateDeliveryDate(); 
//           this.saveDeliveryDetailsToLocalStorage(); 
//           this.deliveryChecked = true;
//         } else {
//           SweetAlert.errorAlert("Error!", data.message);
//           this.deliveryChecked = false;
//         }
//       },
//       error: err => {
//         SweetAlert.errorAlert("Error!", err.error.message);
//         this.deliveryChecked = false;
//       }
//     });
//   }
  
//   calculateDeliveryDate(): void {
//     const currentDate = new Date();
//     this.deliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
//   }

//   saveDeliveryDetailsToLocalStorage(): void {
//     const currentDate = new Date();
//     this.deliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 5));
  
//     const deliveryDetails = {
//       pincode: this.form.value.pincode,
//       amount: this.deliveryDetails.amount,
//       deliveryDate: this.deliveryDate.toISOString() 
//     };
//     localStorage.setItem('deliveryDetails', JSON.stringify(deliveryDetails));
//   }

//   getSavedDeliveryDetails(): void {
//     const savedDetails = localStorage.getItem('deliveryDetails');
//     if (savedDetails) {
//       const details = JSON.parse(savedDetails);
//       this.deliveryDetails = details;
//       this.deliveryDate = new Date(details.deliveryDate);
//       this.form.controls['pincode'].setValue(details.pincode);
//       this.deliveryChecked = true;
//     }
//   }

//   onSubmit(): void {
//     if (!this.deliveryChecked) {
//       SweetAlert.errorAlert("Error!", "Please check delivery availability before adding a vehicle.");
//       return;
//     }

//     this.submitted = true;
  
//     if (this.form.invalid) {
//       return;
//     }
  
//     if (!this.vehicleInfo) {
//       SweetAlert.errorAlert("Error!", "Please check vehicle number before adding to phone number.");
//       return;
//     }
  
//     const user = this.storageService.getUser();
//     if (!user || !user.userId) {
//       SweetAlert.errorAlert("Error!", "User ID is required.");
//       return;
//     }
  
//     const reqBody = {
//       registrationNumber: this.form.value.registrationNumber.trim(),
//       phone: this.form.value.phone.trim(),
//       userId: user.userId,
//       insertDateTime: this.currentDateTime
//     };
  
//     console.log("Submitting vehicle:", reqBody);
  
//     this.apiService.addVehicle(reqBody).subscribe({
//       next: data => {
//         if (data && data.status === 200) {
//           SweetAlert.successAlert("Success", "Vehicle added successfully.");
//           this.submitted = false;
//           console.log("Registration Number:", reqBody.registrationNumber);
//           this.vehicleAdded = true;
//           this.vehicleInfo = true;
//           this.getVehileDetailsByDB(reqBody.registrationNumber);
//         }
//       },
//       error: err => {
//         SweetAlert.errorAlert("Error!", err.error.message);
//       }
//     });
//   }
  

//   getVehicleDetails(): void {
//     if (!this.deliveryChecked) {
//       SweetAlert.errorAlert("Error!", "Please check delivery availability before checking vehicle info.");
//       return;
//     }

//     const reg_no = this.form.value.registrationNumber.trim();
//     if (!reg_no) {
//       SweetAlert.errorAlert("Error!", "Registration Number is required.");
//       return;
//     }

//     this.apiService.getVehicleDetails(reg_no).subscribe({
//       next: data => {
//         if (data && data.status === 200) {
//           this.vehicleDetails = data.data;
//           this.vehicleInfo = true; 
//         } else {
//           SweetAlert.errorAlert("Error!", data.message);
//         }
//       },
//       error: err => {
//         SweetAlert.errorAlert("Error!", err.error.message);
//       }
//     });
//   }

//   getVehileDetailsByDB(reg_no: string): void {
//     this.apiService.getVehileDetailsByDB(reg_no).subscribe({
//       next: data => {
//         if (data && data.status === 200) {
//           this.vehicleDetails = data.data; 
//         } else {
//           SweetAlert.errorAlert("Error!", data.message);
//         }
//       },
//       error: err => {
//         SweetAlert.errorAlert("Error!", err.error.message);
//       }
//     });
//   }

//   openAddAddressModal() {
//     if (!this.deliveryChecked) {
//       SweetAlert.errorAlert("Error!", "Please check delivery availability before adding an address.");
//       return;
//     }

//     if (!this.vehicleAdded) {
//       SweetAlert.errorAlert("Error!", "Please add a vehicle number before before adding an address.");
//       return;
//     }
  
//     const initialState = { userId: this.userId };
//     const modalRef = this.modalService.show(AddAddressComponent, { initialState });

//     if (modalRef.content) {
//       modalRef.content.onClose.subscribe((newAddress: any) => {
//         this.onAddressAdded(newAddress);
//         this.getAddress(); 
//         modalRef.hide();
//       });
//     }
//   }

//   onAddressAdded(newAddress: any): void {
//     this.addresses.push(newAddress); 
//     this.selectedAddress = newAddress;
//     this.addressAdded = true; 
//   }

//   getAddress(): void {
//     if (!this.userId) {
//       SweetAlert.errorAlert("Error!", "User ID is required.");
//       return;
//     }
//     this.apiService.getUserAddress(this.userId).subscribe({
//       next: (data) => {
//         console.log('User Data:', data);
//         if (data && data.status == 200) {
//           this.addresses = data.data;
//           this.selectedAddress = this.addresses[0]; 
//           this.addressAdded = this.addresses && this.addresses.length > 0; 
//         } else {
//           this.addresses = [];
//           this.addressAdded = false;
//         }
//       },
//       error: (err) => {
//         console.error("Error!", err.error.message);
//         this.addresses = []; 
//         this.addressAdded = false; 
//       },
//     });
//   }

//   ChangeAddress(): void {
//     if (!this.deliveryChecked) {
//       SweetAlert.errorAlert("Error!", "Please check delivery availability before changing address.");
//       return;
//     }
//     const initialState = { userId: this.userId };
//     this.modalRef = this.modalService.show(AddressComponent, { initialState });
    
//     this.modalRef.content.onClose.subscribe((updatedAddress: any) => {
//       this.selectedAddress = updatedAddress; 
//       this.modalRef?.hide();
//     });
//   }

//   openAddressModal(): void {
//     if (!this.deliveryChecked) {
//       SweetAlert.errorAlert("Error!", "Please check delivery availability before selecting address.");
//       return;
//     }
//     const initialState = { userId: this.userId };
//     this.modalRef = this.modalService.show(AddressComponent, { initialState });

//     this.modalRef.content.onClose.subscribe((selectedAddress: any) => {
//       this.selectedAddress = selectedAddress;
//       this.modalRef?.hide();
//     });
//   }

//   onAddressSelected(selectedAddress: any): void {
//     this.addresses[0] = selectedAddress;
//     this.modalRef?.hide();
//   }

//   displaySelectedAddress(): void {
//     return this.selectedAddress ? this.selectedAddress : { name: 'No Address Selected' };
//   }

//   proceedToPayment(): void {
//     if (!this.deliveryChecked) {
//       SweetAlert.errorAlert("Error!", "Please check delivery availability before proceeding to payment.");
//       return;
//     }

//     if (!this.vehicleAdded) {
//       SweetAlert.errorAlert("Error!", "Please add a vehicle number before proceeding to payment.");
//       return;
//     }
  
//     if (!this.addressAdded) {
//       SweetAlert.errorAlert("Error!", "Please add an address before proceeding to payment.");
//       return;
//     }
  
//     const deliveryDetails = this.deliveryDetails || {};
//     const reqBody = {
//       vehicleId: this.vehicleDetails._id,
//       userId: this.userId,
//       addressId: this.selectedAddress._id,
//       addressDetail: this.selectedAddress,
//       delivery_charge: this.deliveryDetails.amount || 0,
//       amount: this.deliveryDetails.amount || 0,
//       insertDateTime: this.currentDateTime
//     };

  
//     this.apiService.proceedToPayment(reqBody).subscribe({
//       next: data => {
//         if (data.status === 200) {
//           this.router.navigate(['paymentCarWhistler'], { queryParams: { transitionId: data.data.transitionId } });
//           SweetAlert.successAlert("Success", "Payment processed successfully.");
//         } else {
//           SweetAlert.errorAlert("Error!", data.message);
//         }
//       },
//       error: err => {
//         SweetAlert.errorAlert("Error!", err.error.message);
//       }
//     });
//   }

//   goBack(): void {
//     this.router.navigate(['/dashboard']);
//   }
  
  
// }
  