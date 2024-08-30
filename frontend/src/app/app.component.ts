import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { StorageService } from "./services/storage.service";
import { AuthService } from "./services/auth.service";
import { EventBusService } from "./shared/event-bus.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  isLoggedIn = false;

  eventBusSub?: Subscription;

  constructor(private storageService: StorageService, private authService: AuthService, private eventBusService: EventBusService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.router.navigate(["dashboard"]);
    }

    this.eventBusSub = this.eventBusService.on("logout", () => {
      this.logout();
    });
  }

  logout(): void {
    this.storageService.clean();
    window.location.reload();
  }
  title: any = "Car Whistler";
}
