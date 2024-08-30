import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import SweetAlert from 'src/app/utils/sweetAlert';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  userId: string;
  vehicles: any[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
  }

  ngOnInit(): void {
    this.getCartItemsByUserId();
  }

  getCartItemsByUserId(): void {
    this.apiService.getCartItemsByUserId(this.userId).subscribe({
      next: data => {
        if (data && data.status === 200) {
          this.vehicles = data.data;
        }
      },
      error: err => {
        console.error("Error fetching cart items!", err.error.message);
      }
    });
  }

  order(vehicleId: string): void {
    this.router.navigate(['order'], { queryParams: { vehicleId: vehicleId } });
  }

  buySticker(): void {
    this.router.navigate(['addVehicle']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

}
