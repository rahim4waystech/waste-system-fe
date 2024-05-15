import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';

@Injectable({
    providedIn: 'root'
  })
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService, private router: Router) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.auth.isLoggedIn()) {

          if(!request.headers.get('Authorization')) {
              request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + this.auth.getToken()) });
            }
          }

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });


      return next.handle(request).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event;

        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigateByUrl('/login');

            // The http call was forbidden so route to the forbidden page on the frontend :)
          } else if(err.status === 403 || err.status === 401) {

            this.router.navigateByUrl('/forbidden');
          }
        }
      });
    }
}
