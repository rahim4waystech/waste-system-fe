import { Component, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { setTheme } from 'ngx-bootstrap/utils';
import { filter } from 'rxjs/operators';

declare var require: any;
declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ height: 0, opacity: 0 }),
            animate('1s ease-out',
                    style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ height: 300, opacity: 1 }),
            animate('1s ease-in',
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AppComponent implements OnDestroy {
  title = 'waste-system-fe';
  interval: any = null;

  constructor(
    private oauthService: OAuthService,
    private router: Router,
    private authService: AuthService) {


    setTheme('bs4'); // or 'bs4'

    // Move this to a config file

    this.oauthService.tokenEndpoint = environment.api.endpoint + 'auth/token/';

    // this.oauthService.scope = "";

    this.oauthService.dummyClientSecret = environment.api.clientSecret;

    this.oauthService.clientId = environment.api.clientId;

    this.oauthService.userinfoEndpoint = '';

    this.oauthService.requireHttps = false;


    // Checks to ensure token has not expired
    this.interval = setInterval(() => {
      require('./../app/oauthwrapper.js')(authService);
      this.checkForTokenExpiry();
    }, 3000);

    if(environment.isSimply) {
      const body = document.getElementsByTagName('body')[0];
      body.classList.add('isSimplyBody');
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
       $('body').removeClass('jw-modal-open');
    });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  isSimply() {
    return environment.isSimply;
  }

  // Checks access token to ensure it hasn't expired if it has return to login page
  checkForTokenExpiry(): void {
    const expiry = moment(this.authService.getTokenExpiry());

    if(moment().isSameOrAfter(expiry)) {
      this.authService.refreshActiveToken().subscribe((data) => {

      });
    }
  }
}
