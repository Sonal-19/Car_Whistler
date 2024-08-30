import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

const AUTH_API = environment.authApiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // constructor(private http: HttpClient) { }
  constructor(private http: HttpClient, private storageService: StorageService ) { }
  
  register(reqBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/register',
      reqBody,
      httpOptions
    );
  }

  verifyOtp(data: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/verify-otp',
      data,
      httpOptions
    );
  }

  resendOtp(data: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/resend-otp',
      data,
      httpOptions
    );
  }

  saveUser(user: any): void {
    console.log("User data being saved: ", user.data);
    this.storageService.saveUser(user);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/forgot-password',
      data,
      httpOptions
    );
  }

  resetEmailPassword(data: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/reset-email-password',
      data,
      httpOptions
    );
  }


  signIn(reqBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/signin',
      reqBody,
      httpOptions
    );
  }
}
