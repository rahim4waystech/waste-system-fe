import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    // TODO: ACLs
    if(!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      return false;
    } else {
debugger;
     const pathCheck = '/'+next.routeConfig.path;

  
    if(pathCheck === '/home' || this.authService.checkIfUserCanAccessRoute(pathCheck)) {
      
    return true;
    } else {
      this.router.navigateByUrl('/forbidden');
    }
    }
  }

}
