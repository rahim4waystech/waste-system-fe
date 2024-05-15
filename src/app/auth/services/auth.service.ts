import { Injectable } from '@angular/core';
import { OAuthService, OAuthStorage } from 'angular-oauth2-oidc';
import { from, Observable } from 'rxjs';

import { map } from "rxjs/operators";
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EnvironmentService } from 'src/app/settings/services/environment.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: boolean = false;

  private token: string = '';
  private refreshToken: string = '';


  private user: any = {};

  private tokenExpiry: string = '';

  private env: any = {};


  private LC_ACCESS_TOKEN_KEY: string = 'CRM_TMC_ACCESS_TOKEN';
  private LC_ACCESS_TOKEN_EXPIRY_KEY: string = 'CRM_TMC_ACCESS_TOKEN_EXPIRY';
  private LC_USER_PROFILE: string = 'CRM_TMC_USER_PROFILE';
  private LC_REFRESH_TOKEN_KEY: string = 'CRM_TMC_REFRESH_TOKEN';
  private LC_ENV_KEY: string = 'CRM_TMC_ENV';

  constructor(private oAuthService: OAuthService,
    private http: HttpClient) {


    if(this.getAccessTokenFromLC() !== null) {
      this.token = this.getAccessTokenFromLC();
      this.loggedIn = true;
      this.user = this.getUserProfileFromLC();
      this.tokenExpiry = this.getTokenExpiryFromLC();
      this.refreshToken = this.getRefreshTokenFromLC();
      this.env = this.getEnvFromLC();
    }
  }

  isGuest(): boolean {
    return !this.loggedIn;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getEnvSetting(settingName: string): string {

    if(!settingName) {
      return '';
    } else {
      return this.env[settingName];
    }
  }

  refreshActiveToken(): Observable<any> {
    const body = new HttpParams()
    .set('grant_type', 'refresh_token')
    .set('client_id', environment.api.clientId)
    .set('client_secret', environment.api.clientSecret)
    .set('refresh_token', this.getRefreshTokenFromLC());


    return this.http.post(environment.api.endpoint + "auth/token",
    body.toString(),
    {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', 'Bearer ' + this.getAccessTokenFromLC())
    }
    ).pipe(map((result: any) => {
      this.user = result.user;
      this.token = result.accessToken;
      this.loggedIn = true;
      this.tokenExpiry = result.accessTokenExpiresAt;
      this.refreshToken = result.refreshToken;
      this.env = result.env;

      if(!this.env) {
        this.env = {};
      }

      localStorage.setItem(this.LC_USER_PROFILE, JSON.stringify(this.user));
      localStorage.setItem(this.LC_ACCESS_TOKEN_KEY, this.token);
      localStorage.setItem(this.LC_ACCESS_TOKEN_EXPIRY_KEY, String(this.tokenExpiry));
      localStorage.setItem(this.LC_REFRESH_TOKEN_KEY, this.refreshToken);
      localStorage.setItem(this.LC_ENV_KEY, JSON.stringify(this.env));

    }));

  }

  login(username: string, password: string): Observable<any> {

    const isInvalidUsername = username === null || username === undefined || username === '';
    const isInvalidPassword = password === null || password === undefined || password === '';

    if(isInvalidUsername || isInvalidPassword) {
      throw new Error('You must provide a username and password');
    }

    return from(this.oAuthService.fetchTokenUsingPasswordFlow(username, password)).pipe(map((result: any) => {
     
     debugger;
      this.user = result.user;
      this.token = result.accessToken;
      this.loggedIn = true;
      this.tokenExpiry = result.accessTokenExpiresAt;
      this.refreshToken = result.refreshToken;
      this.env = result.env;

      if(!this.env) {
        this.env = {};
      }

      localStorage.setItem(this.LC_USER_PROFILE, JSON.stringify(this.user));
      localStorage.setItem(this.LC_ACCESS_TOKEN_KEY, this.token);
      localStorage.setItem(this.LC_ACCESS_TOKEN_EXPIRY_KEY, String(this.tokenExpiry));
      localStorage.setItem(this.LC_REFRESH_TOKEN_KEY, this.refreshToken);
      localStorage.setItem(this.LC_ENV_KEY, JSON.stringify(this.env));

    }));
  }

  getToken(): string {
    return this.token;
  }

  logOut(): void {


    localStorage.removeItem(this.LC_ACCESS_TOKEN_EXPIRY_KEY);
    localStorage.removeItem(this.LC_ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.LC_USER_PROFILE);
    localStorage.removeItem(this.LC_REFRESH_TOKEN_KEY);


    this.user = {};
    this.loggedIn = false;
    this.token = '';

    this.oAuthService.logOut();
  }

  getUser(): any {
    return this.user;
  }

  getTokenExpiry(): string {
    return this.tokenExpiry;
  }

  getPermissionAreas(): string[] {
    let areas: string[] = [];

    this.user.userGroupPermissions.forEach((userPermission: any) => {
      areas.push(userPermission.permission.permissionArea.name);
    });

    return areas;
  }

  isGod(): boolean {
    let isGod: boolean = false;

    this.user.userGroupPermissions.forEach((userPermission: any) => {
      if(!isGod) {
        isGod = userPermission.permission.name.indexOf('God Mode') !== -1;
      }
    });

    return isGod;
  }

  getUserGroupPermissions(): any[] {
    return this.user.userGroupPermissions;
  }

  checkIfHasPermissionArea(permissionAreaId: number=-1) {

    if(!this.isLoggedIn()) {
      return false;
    }

    console.log(permissionAreaId);
    return this.user.userGroupPermissions.filter((userGroupPermission) => userGroupPermission.permission.permissionAreaId === permissionAreaId).length > 0 
    || this.isGod();
  }

  checkIfUserCanAccessRoute(route: string='') {
    debugger;
    if(!this.isLoggedIn()) {
      return false;
    }
    return this.user.userGroupPermissions.filter(up => up.permission.components.split(',').indexOf(route) !== -1).length > 0
    || this.isGod(); 
  }
  

  private getAccessTokenFromLC(): string {
    const token = localStorage.getItem(this.LC_ACCESS_TOKEN_KEY);

    if(token === null || token === undefined || token === '') {
      return null;
    } else {
      return token;
    }
  }

  private getUserProfileFromLC(): any {
    const item = localStorage.getItem(this.LC_USER_PROFILE);

    if(item === null || item === undefined || item === '') {
      return null;
    } else {
      return JSON.parse(item);
    }
  }


  private getTokenExpiryFromLC(): any {
    const item = localStorage.getItem(this.LC_ACCESS_TOKEN_EXPIRY_KEY);

    if(item === null || item === undefined || item === '') {
      return null;
    } else {
      return item;
    }
  }

  private getRefreshTokenFromLC(): any {
    const item = localStorage.getItem(this.LC_REFRESH_TOKEN_KEY);

    if(item === null || item === undefined || item === '') {
      return null;
    } else {
      return item;
    }
  }

  private getEnvFromLC(): any {
    const item = localStorage.getItem(this.LC_ENV_KEY);

    if(item === null || item === undefined || item === '') {
      return null;
    } else {
      return JSON.parse(item);
    }
  }


}
