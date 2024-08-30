import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { HeaderComponent } from './header/header.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { AddVehicleComponent } from './pages/add-vehicle/add-vehicle.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ClickToCallComponent } from './pages/click-to-call/click-to-call.component';
import { EmailOtpVerifyComponent } from './auth/email-otp-verify/email-otp-verify.component';
import { ResetEmailPasswordComponent } from './auth/reset-email-password/reset-email-password.component';
import { AddressComponent } from './pages/address/address.component';
import { AddAddressComponent } from './pages/add-address/add-address.component';
import { EditAddressComponent } from './pages/edit-address/edit-address.component';
import { PaymentCarWhistlerComponent } from './pages/payment-car-whistler/payment-car-whistler.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrderComponent } from './pages/order/order.component';

@NgModule({
  declarations: [
    HomeLayoutComponent,
    LoginLayoutComponent,
    HeaderComponent,
    NavigationComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    AddVehicleComponent,
    UserProfileComponent,
    ClickToCallComponent,
    EmailOtpVerifyComponent,
    ResetEmailPasswordComponent,
    AddressComponent,
    AddAddressComponent,
    EditAddressComponent,
    PaymentCarWhistlerComponent,
    CartComponent,
    OrderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    HomeLayoutComponent,
    LoginLayoutComponent,
    HeaderComponent,
    NavigationComponent,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    DatePipe
  ]
})
export class CustomModule {
  constructor() {}
}
