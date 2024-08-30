import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { StorageService } from 'src/app/services/storage.service';
import SweetAlert from 'src/app/utils/sweetAlert';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  vehicles: any[] = [];
  userId: string = '';

  constructor(
    public router: Router,
    private apiService: ApiService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.userId = this.storageService.getUser().userId;
    this.fetchVehicles();
  }

  buySticker(): void {
    this.router.navigate(['addVehicle']);
  }

  fetchVehicles(): void {
    this.apiService.getVehiclesByUserId(this.userId).subscribe({
      next: (data) => {
        if (data && data.status === 200) {
          this.vehicles = data.data;
          this.reverseVehicles();
        } else {
          SweetAlert.errorAlert('Error!', data.message);
        }
      },
    });
  }

  reverseVehicles(): void {
    this.vehicles.reverse();
  }

  deleteVehicle(vehicleId: string): void {
    console.log('Attempting to delete vehicle:', vehicleId);

    SweetAlert.confirmationAlert(
      'Are you sure?',
      'This vehicle will be permanently deleted.',
      'warning'
    ).then((confirmed) => {
      if (confirmed) {
        this.apiService.deleteVehicle(vehicleId).subscribe({
          next: (data) => {
            console.log('Delete response:', data);
            if (data && data.status === 200) {
              SweetAlert.successAlert('Deleted!', 'Vehicle deleted successfully.');
              this.removeVehicleFromList(vehicleId);
            } else {
              SweetAlert.errorAlert('Error!', data.message);
            }
          },
          error: (err) => {
            console.log('Error deleting vehicle:', err);
            SweetAlert.errorAlert('Error!', 'Failed to delete vehicle.');
          }
        });
      } else {
        console.log('Deletion canceled by user.');
      }
    }).catch((error) => {
      console.error('Error during confirmation alert:', error);
      SweetAlert.errorAlert('Error!', 'Something went wrong during confirmation.');
    });
  }

  removeVehicleFromList(vehicleId: string): void {
    this.vehicles = this.vehicles.filter((v) => v._id !== vehicleId);
  }


}
