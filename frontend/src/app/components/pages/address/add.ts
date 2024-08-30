// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ApiService } from 'src/app/services/api.service';
// import SweetAlert from 'src/app/utils/sweetAlert';

// @Component({
//   selector: 'app-address',
//   templateUrl: './address.component.html',
//   styleUrls: ['./address.component.css']
// })
// export class AddressComponent implements OnInit {
//   userId: string;
//   // registrationNumber: string;
//   //addressId: string;
//   addresses: any[] = [];
//   selectedAddress: string = '';
 

//   constructor(
//     private apiService: ApiService,
//     private router: Router,
//     private route: ActivatedRoute,
//   ) {
//     this.userId = this.route.snapshot.paramMap.get('userId') || '';
//     // this.registrationNumber = this.route.snapshot.paramMap.get('reg_no') || '';
//     console.log('User ID:', this.userId);
//     // console.log('Registration Number:', this.registrationNumber);
//     //console.log('Address ID:', this.addressId);
//   }

//   ngOnInit(): void {
//     this.getAddresses();
//   }

//   getAddresses(): void {
//     this.apiService.getAddress(this.userId).subscribe({
//       next: (data) => {
//         console.log('User Data:', data);
//         if (data && data.status == 200) {
//           this.addresses = data.data;
//         }
//       },
//       error: (err) => {
//         console.error("Error!", err.error.message);
//       },
//     });
//   }

//   // navigateToCartPage(): void {
//   //   if (!this.selectedAddress) {
//   //     SweetAlert.errorAlert("Error!", "Address is required.");
//   //     return;
//   //   }
  
//   //   const cartReqBody = {
//   //     userId: this.userId,
//   //     reg_no: this.registrationNumber,
//   //     addressId: this.selectedAddress 
//   //   };
//   //   this.apiService.addToCart(cartReqBody).subscribe({
//   //     next: cartData => {
//   //       SweetAlert.successAlert("Success", "Vehicle and address added to cart successfully.");
//   //       this.router.navigate(['cart', this.userId]);
//   //     },
//   //     error: err => {
//   //       SweetAlert.errorAlert("Error!", err.error.message);
//   //     }
//   //   });
//   // }

//   navigateToAddVehiclePage(): void {
//     if(this.selectedAddress){
//       this.router.navigate(['addVehicle', this.userId]);
//       console.log('Selected Address: ', this.selectedAddress);
//     }
//   }

//   editAddress(addressId: string): void {
//     this.router.navigate(['editAddress', this.userId, addressId ]);
//     // this.router.navigate(['editAddress', this.userId, addressId, { reg_no: this.registrationNumber } ]);
//     console.log("editaddress: ", this.userId, addressId);
//   }

//   deleteAddress(addressId: string): void {
//     this.apiService.deleteAddress(addressId).subscribe({
//       next: (data) => {
//         if (data && data.status == 200) {
//           this.getAddresses();
//         }
//       },
//       error: (err) => {
//         console.error("Error!", err.error.message);
//       },
//     });
//   } 

//   addNewAddress(): void {
//     this.router.navigate(['addAddress', this.userId]);
//     // this.router.navigate(['addAddress', this.userId, { reg_no: this.registrationNumber }]);
//     console.log("userid: ", this.userId);
//   }

// }