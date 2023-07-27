import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanLoad, CanActivate } from '@angular/router';
import { AppConstants } from 'src/app/shared/constants/app.constants';
import { CommonService } from '../services/common.service';

@Injectable()

export class RoleGuardService implements CanActivate  {
    constructor(
      private router: Router,
      private commonService: CommonService) {
    }

    canActivate(): boolean {
        let isExpectedRole = false;
        isExpectedRole = this.commonService.findExpectedRole(AppConstants.RESOURCE_ADMIN_ID);
        if(isExpectedRole) {
            if(this.router.url.includes('/resources')) {
              this.router.navigateByUrl('/unauthorized-user');
            } else {
              this.router.navigateByUrl('/resources/blogs');
            }
        }
        return true;
    }

}