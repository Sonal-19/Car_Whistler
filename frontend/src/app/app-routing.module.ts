import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLayoutComponent } from './components/layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './components/layouts/login-layout/login-layout.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { AddVehicleComponent } from './components/pages/add-vehicle/add-vehicle.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import { ClickToCallComponent } from './components/pages/click-to-call/click-to-call.component';
import { AuthGuard } from './services/auth.guard';
import { EmailOtpVerifyComponent } from './components/auth/email-otp-verify/email-otp-verify.component';
import { ResetEmailPasswordComponent } from './components/auth/reset-email-password/reset-email-password.component';
import { AddressComponent } from './components/pages/address/address.component';
import { AddAddressComponent } from './components/pages/add-address/add-address.component';
import { EditAddressComponent } from './components/pages/edit-address/edit-address.component';
import { PaymentCarWhistlerComponent } from './components/pages/payment-car-whistler/payment-car-whistler.component';
import { CartComponent } from './components/pages/cart/cart.component';
import { OrderComponent } from './components/pages/order/order.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent
      }
    ]
  },
  {
    path: 'register',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: RegisterComponent
      }
    ]
  },
  {
    path: 'email-otp-verify',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: EmailOtpVerifyComponent
      }
    ]
  },
  {
    path: 'forgotPassword',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: ForgotPasswordComponent
      }
    ]
  },
  {
    path: 'resetEmailPassword',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: ResetEmailPasswordComponent
      }
    ]
  },
  {
    path: 'dashboard',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'addVehicle',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: AddVehicleComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'cart/:userId',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: CartComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'order',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: OrderComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'paymentCarWhistler',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: PaymentCarWhistlerComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'profile/:userId',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: UserProfileComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'address/:userId',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: AddressComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'addAddress/:userId',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: AddAddressComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'editAddress/:userId/:addressId',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        component: EditAddressComponent
      }
    ],
    canActivate:[AuthGuard]
  },
  {
    path: 'clickToCall',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: ClickToCallComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
