import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { StorageService } from "../services/storage.service";
import { AuthService } from "../services/auth.service";
import { EventBusService } from "../shared/event-bus.service";
import { EventData } from "../shared/event.class";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService, private eventBusService: EventBusService, private toasterService: ToastrService, public authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jwt = this.storageService.getToken();
    if (jwt) {
      req = req.clone({
        withCredentials: true,
        setHeaders: { authentication: `Bearer ${jwt}` },
      });
    } else {
      req = req.clone({
        withCredentials: true,
      });
    }

    return next.handle(req).pipe(
      tap({
        next: (event: any) => {
          if (event instanceof HttpResponse) {
            if (event.status === 401) {
              this.toasterService.error("Unauthorized access!", "Error");
              this.storageService.clean();
              setTimeout(this.reload, 3000);
            } else if (event.status === 0) {
              this.toasterService.error("Server has stopped!", "Error");
              this.storageService.clean();
              setTimeout(this.reload, 3000);
            }
          }
          return event;
        },
        error: (error: any) => {
          if (error.status === 401) {
            this.toasterService.error("Unauthorized access!", "Error");
            this.storageService.clean();
            setTimeout(this.reload, 3000);
          } else if (error.status === 0) {
            this.toasterService.error("Server has stopped!", "Error");
            this.storageService.clean();
            setTimeout(this.reload, 3000);
          }
        },
      })
    );
  }

  public  reload(){
    window.location.reload()
  }
}

export const httpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }];
