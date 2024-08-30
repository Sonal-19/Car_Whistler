import { Component, EventEmitter, Input, OnInit, Output,  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import SweetAlert from 'src/app/utils/sweetAlert';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AddAddressComponent } from '../add-address/add-address.component';
import { EditAddressComponent } from '../edit-address/edit-address.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  @Input() userId!: string;
  modalRef?: BsModalRef;
  addresses: any[] = [];
  selectedAddress: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
   private modalService: BsModalService,

  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    console.log('User ID:', this.userId);
  }

  ngOnInit(): void {
    this.getAddresses();
  }

  getAddresses(): void {
    if (!this.userId) {
      SweetAlert.errorAlert("Error!", "User ID is required.");
      return;
    }
    this.apiService.getAddress(this.userId).subscribe({
      next: (data) => {
        console.log('User Data:', data);
        if (data && data.status === 200) {
          this.addresses = data.data;
          this.selectedAddress = this.addresses[0];
        }
      },
      error: (err) => {
        console.error("Error!", err.error.message);
      },
    });
  }

  selectAddress(address: any): void {
    this.selectedAddress = address;
  }

  confirmSelection(): void {
    if (this.selectedAddress) {
      this.onClose.emit(this.selectedAddress);
    } else {
      SweetAlert.errorAlert("Error!", "Please select an address.");
    }
  }

  editAddress(address: any): void {
    const initialState = { userId: this.userId, addressId: address._id };
    this.modalRef = this.modalService.show(EditAddressComponent, { initialState });

    this.modalRef.content.onClose.subscribe((updatedAddress: any) => {
      if (updatedAddress) {
        this.addresses = this.addresses.map(addr => addr._id === updatedAddress._id ? updatedAddress : addr);
        this.selectedAddress = updatedAddress; 
      }
      this.modalRef?.hide();
    });
  }

  deleteAddress(addressId: string): void {
    this.apiService.deleteAddress(addressId).subscribe({
      next: (data) => {
        if (data && data.status === 200) {
          this.getAddresses();
        }
      },
      error: (err) => {
        console.error("Error!", err.error.message);
      },
    });
  }

  addNewAddress(): void {
    const initialState = { userId: this.userId };
    this.modalRef = this.modalService.show(AddAddressComponent, { initialState });

    this.modalRef.content.onClose.subscribe((newAddress: any) => {
      if (newAddress) {
        this.addresses.push(newAddress); 
        this.selectedAddress = newAddress; 
      }
      this.modalRef?.hide();
    });
  }

  onCloseModal(): void {
    this.modalService.hide();
  }


}
