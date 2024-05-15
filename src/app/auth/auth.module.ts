import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';

import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
