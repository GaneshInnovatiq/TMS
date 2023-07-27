import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  loginForm!:FormGroup 
  email:any
  error:any
  password:any
  showPassword: boolean = false;
  show=false;
  isLoading = false;
  constructor(
    private fb:FormBuilder,
    private authService:AuthService,
    private router: Router,
    
    //private snackbar: MatSnackBar,
  ){

  }
    ngOnInit():void{
      //this.password = 'password';
    this.loginForm= this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password: ['', Validators.required],
      logintype: ['admin'],
      type: ['admin']

    })
  }
  loginUser(){
    console.log("=======")
  let formData =this.loginForm.getRawValue()
  console.log(formData)
  this.isLoading = true;

  this.authService.loginUser(formData.email.trim(), formData.password.trim(), formData.logintype.trim(), formData.type.trim())
        .subscribe(user => {
          console.log("User",user);
          this.isLoading = false;
          this.router.navigateByUrl('/list');
         //this.isLoading = false;
          const menuItems = user?.menuItems;
          //this.commonService.setMenuItems()

          //this.loadStaticData();
          this.authService.saveUserInfo(user);
        }, (error) => {
          console.log("User",error);
          this.isLoading = false;
          this.error = error;
          if(error.errors){
          this.email=error.errors.map((test: { email: any; }) =>test.email&&test.email?test.email:"");
          this.password= error.errors.map((test: { password: any; }) =>test.password&&test.password?test.password:"");
          }
          if(error.message){
          this.email=error.message
          }

          }

          )
          
          // if(error.errors[0]?.email&&error.errors[0]?.email){
          // this.email=error.errors[0]?.email?error.errors[0].email:""
          // }
          // if(error.errors[0]?.password){
          // this.password=error.errors[0]?.password?error.errors[0].password:""
          // }
          // if(error.errors[1]?.email){
          // this.email=error.errors[1]?.email?error.errors[1].email:""
          // }
          // if(error.errors[1]?.password){
          // this.password=error.errors[1]?.password?error.errors[1].password:""
          // }
 
 
          //  // this.isLoading = false;
          console.log("--",)
         // this.email = error.errors[0]
          
            // this.snackbar.open(error.message, "null", {
            //     duration: 3000
            // });
       // });
       // this.submitted = false;
  }
  onClick() {
    this.showPassword = !this.showPassword;
  }
  clearError(field: string) {
    console.log("--ssddddddddddd-",field)
    if (field=="email") {
      this.email=""
     // delete this.error[field];
    } else {
      this.password=""

    }
  }
  
}
