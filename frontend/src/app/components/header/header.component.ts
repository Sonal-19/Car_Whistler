import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { StorageService } from 'src/app/services/storage.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  username?: String;
  userId?: string;
  email?: string;
  cartItemCount: number = 0;
  
  constructor(
    private storageService: StorageService,
    private apiService: ApiService,
    public router: Router,
    public toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.username = user.fullName;
      this.email = user.email;
      this.userId = user.userId;
      this.getCartItemCount();
    }
  }

  signOut() {
    this.storageService.clean();
    window.location.reload();
  }

  viewProfile() {
    this.router.navigate(['profile', this.userId]);
    console.log("userid: ", this.userId);
  }

  viewCart(): void {
    this.router.navigate(['cart', this.userId]);
    console.log("userid: ", this.userId);
  }

  getCartItemCount(): void {
    if (this.userId) {
      this.apiService.getCartItemsByUserId(this.userId).subscribe({
        next: data => {
          if (data && data.status === 200) {
            this.cartItemCount = data.data.length;
          }
        },
        error: err => {
          console.error("Error fetching cart items count!", err.error.message);
        }
      });
    }
  }

}
