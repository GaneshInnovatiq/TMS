import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CAAS';
  
  isSideBarcollapsed = false;
  constructor(public router: Router,
    private authService: AuthService){
  }
  collapsed :boolean = false;
  openSidebar: boolean = true;
  status: boolean = false;

  @HostListener('window:resize', ['$event'])
  
  onResize(event: any) {
    console.log(event.target.innerWidth)
    const needCollapse = event.target.innerWidth < 992
    if(needCollapse!==this.status) {
      this.status = needCollapse;
    }
    
  }

  ngOnInit(): void {
    
    this.isAuthenticated()
  }

  
  isAuthenticated() {
    return this.authService.getAccessToken();
  }


  setIsCollapsed(isCollapsed: boolean) {
    this.isSideBarcollapsed = isCollapsed;
  }

addToggle()
{
  this.status = !this.status;       
}
}
