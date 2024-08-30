import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const USER_KEY = environment.userKey;

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor() {}

  clean(): void {
    window.sessionStorage.clear();
  }

  public saveUser(user: any): void {
    console.log("Saving user data: ", user);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user.data));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    console.log("Retrieved user data: ", user);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public isLoggedIn(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }

  public getToken(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const jsonUser = JSON.parse(user);
      return jsonUser.access_token;
    }
    return false;
  }
}
