import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthsRoutingModule } from './auths-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoginService } from 'src/app/auths/services/login.service';


@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    AuthsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[LoginService]
})
export class AuthsModule { }
