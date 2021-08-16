import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  fg: FormGroup;
  loginFailed = false;
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.fg = this.fb.group({
      email:'', 
      password:''
    });
  }

  onSubmit(){

    this.loginService.login(this.fg.value).subscribe(res=>{
      let name = sessionStorage.getItem('name');
      sessionStorage.setItem('id', res['userId']);
      sessionStorage.setItem('name', res['name']);
      sessionStorage.setItem('token', res['token']);
      sessionStorage.setItem('value1', res['isAdmin']);
      console.log('res in login component, ', res);
      if(res){
        this.router.navigate(['../../dashboard']);
      }else{
        
      }
    }, (error)=>{
      this.loginFailed = true;
      console.log('login failed, ', this.loginFailed);
    })
  }

}
