import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const AUTH_API = environment.authApiUrl;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) { }

  addVehicle(reqBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/addVehicle',
      reqBody,
      httpOptions
    );
  }

  getVehicleDetails(reg_no: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getVehicleDetails/' + reg_no, 
      httpOptions
    );
  }

  getVehileDetailsByDB(reg_no: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getVehileDetailsByDB/' + reg_no, 
      httpOptions
    );
  }

  addAddress(reqBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/addAddress',
      reqBody,
      httpOptions
    );
  }

  getAddress(userId: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getAddress/' + userId,
      httpOptions
    );
  }

  getUserAddress(userId: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getUserAddress/' + userId,
      httpOptions
    );
  }

  updateAddress(addressId: string, reqBody: any): Observable<any> {
    return this.http.put(
      AUTH_API + 'vehicle/updateAddress/' + addressId ,
      reqBody,
      httpOptions
    );
  }

  deleteAddress(addressId: string): Observable<any> {
    return this.http.delete(
      AUTH_API + 'vehicle/deleteAddress/' + addressId,
      httpOptions
    );
  }

  // getVehicleDetails(qrId: string): Observable<any> {
  //   return this.http.get(
  //     // `${AUTH_API}clickToCall?qr_id=${qrId}`,
  //     AUTH_API + 'vehicle/clickToCall' + qrId,
  //      httpOptions);
  // }

  userProfile(reqBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/userProfile',
      reqBody,
      httpOptions
    );
  }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getUserProfile/' + userId,
      httpOptions
    );
  }

  updateUserProfile(userId: string, reqBody: any): Observable<any> {
    return this.http.put(
      AUTH_API + 'vehicle/updateUserProfile/' + userId, 
      reqBody,
      httpOptions
    );
  }
  
  // updateUserProfile(userId: string, formData: FormData): Observable<any> {
  //   return this.http.put(
  //     AUTH_API + 'vehicle/updateUserProfile/' + userId, 
  //     formData,
  //     // httpOptions
  //     { headers: { 'enctype': 'multipart/form-data' } }
  //   );
  // }

  generateQrCode(reqBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/generateQrCode',
      reqBody,
      httpOptions
    );
  }

  getVehicles(reqBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/getVehicles/',
      reqBody,
      httpOptions
    );
  }

  getVehiclesByUserId(userId: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getVehiclesByUserId/' + userId ,
      httpOptions
    );
  }

  getVehicleDetailsById(vehicleId: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getVehicleDetailsById/' + vehicleId,
      httpOptions
    );
  }

  deleteVehicle(vehicleId: string): Observable<any> {
    return this.http.delete(
      AUTH_API + 'vehicle/deleteVehicle/' + vehicleId,
      httpOptions
    );
  }

  getCartItemsByUserId(userId: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getCartItemsByUserId/' + userId,
      httpOptions
    );
  }

  getDeliveryCharges(pincode: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getDeliveryCharges/' + pincode,
      httpOptions
    );
  }

  proceedToPayment(reqBody: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/proceedToPayment' ,
      reqBody,
      httpOptions
    );
  }

  getProceedToPayment(transitionId: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getProceedToPayment/' + transitionId,
      httpOptions
    );
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/createOrder',
      orderData,
      httpOptions
    );
  }

  paymentResponse(paymentData: any): Observable<any> {
    return this.http.post(
      AUTH_API + 'vehicle/paymentResponse',
      paymentData,
      httpOptions
    );
  }

  getOrderDetailsByUserId(userId: string): Observable<any> {
    return this.http.get(
      AUTH_API + 'vehicle/getOrderDetailsByUserId/' + userId,
      httpOptions
    );
  }


}
