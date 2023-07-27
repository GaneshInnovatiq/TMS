import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
//import {  } from '@angular/router';
//import { canActivate } from 'src/app/components/auth/auth.guard';
//import{can
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard  implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.checkIsLogin();
    }

    checkIsLogin(): boolean {

        if (this.authService.getAccessToken()) {
            return true;
            
        }

        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
    }
}
