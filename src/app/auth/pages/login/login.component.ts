import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/core/services/header.service';
import { AuthService } from '../../services/auth.service';

import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { environment } from 'src/environments/environment';
import $ from 'src/assets/js/jquery-3.4.1.min.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /**
   * List of input errors
   */
  private _errors = {};

  // State if there is login error
  isLoginError: boolean = false;

  // binding for email
  email: string = '';

  //binding for password
  password: string = '';


  constructor(private headerService: HeaderService,
    private sidebarService: SidebarService,
    private router: Router,
    private authService: AuthService) {
    this.hideSidebar();
    this.sidebarService.visible = false;
   }

  ngOnInit(): void {
    this.hideSidebar();
    this.sidebarService.visible = false;
    $('.content').addClass('m-auto');
  }

  getLogo() {
    return environment.logo;
  }

  /**
   * Hides the sidebar
   *
   * @returns void
   */
  hideSidebar(): void {
    this.headerService.visible = false;
  }

  /**
   * Valids email and password to check they have been supplied
   *
   * @param email string email to validate
   * @param password string password to validate
   *
   * @returns bool
   */
  validate(email: string, password: string):boolean {
    this._errors = {};
    if(email === null || email === undefined || email === '') {
      this._errors['email'] = 'Please enter a valid email';
    }
    if(password == null || password === undefined || password === '') {
      this._errors['password'] = 'Please enter a valid password';
    }

    return Object.keys(this._errors).length == 0;
  }

  /**
   * Checks to see if a field has an error
   * @param field field to check error for
   *
   * @returns boolean
   */
  hasError(field: string): boolean {
    return this._errors[field] !== undefined;
  }

  /**
   * The following function is fired when the login button is clicked
   *
   * @returns void
   */
  onLoginButtonClicked() {
    this.isLoginError = false;
    if(this.validate(this.email, this.password)) {
      this.authService.login(this.email, this.password).pipe(catchError((e) => {
        this.isLoginError = true;
        return e;
      })).subscribe((value) => {
        this.isLoginError = false;
        this.headerService.visible = true;
        this.sidebarService.visible = true;
        window.location.href = '/';
      })
    } // if the above fail default errors will display using template
  }

}
