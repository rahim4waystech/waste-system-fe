import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { HeaderItem } from '../../models/header-item.model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';
import $ from 'src/assets/js/jquery-3.4.1.min.js';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private headerService: HeaderService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    
  }

  getUrlParts(): string[] {
    return String(window.location.href.replace(window.location.origin + '/', '')).split('/');
  }

  getTidiedUpUrlPart(part: string) { 
    return String(part.charAt(0).toUpperCase() + part.slice(1)).replace(/-/g, ' ');
  }

  getUrlForPart(index: number) {
    const parts = this.getUrlParts();

    let url = "/";

    for(let i = 0; i <= index; i++) {
      url += parts[i];

      if(i !== index) {
        url += "/";
      }
    }

    return url;
  }

  navigate(index) {
    this.router.navigateByUrl(this.getUrlForPart(index));
  }
  
  sidebartoggler(){
    $('.sidebar, .content').toggleClass("open");
    return false;
  }
  /**
   * Gets title from the header service
   *
   * @returns string
   */
  getTitle(): string {
    return this.headerService.title;
  }

  /**
   * Returns is header is visible or not
   *
   * @returna bool
   */
  isVisible(): boolean {
    return this.headerService.visible;
  }

  getStrapline() {
    return environment.strapLine;
  }

  getLogo() {
    return environment.logo;
  }


  /**
   * Gets menu items from the header service
   *
   * @returns HeaderItem[]
   */
  getMenuItems(): HeaderItem[] {
    return this.headerService.items;
  }

  /**
   * Takes a correct action whenmenu item is clicked
   * @param item HeaderItem header item clicked
   *
   * @returns void
   */
  onHeaderItemClicked(item: HeaderItem): void {
    if (item === null || item === undefined) {
      throw new Error('HeaderComponent: Menu item must be defined');
    }

    if (item.action) {
      this.callHeaderItemAction(item);
      return;
    }

    if (item.link) {
      this.navigateInternalLink(item.link);
      return;
    }
  }

  /**
   * Gets current logged in username
   *
   * @returns string
   */
  getUsername(): string {
    return this.authService.getUser().firstName + ' ' + this.authService.getUser().lastName;
  }

  /**
   * Gets current logged in username
   *
   * @returns string
   */
  getAvatar(): string {
    return this.authService.getUser().firstName + '+' + this.authService.getUser().lastName;
  }

  /**
   * Logs user out using auth service
   * @returns void
   */
  logout(): void {
    this.authService.logOut();
    this.router.navigateByUrl('/login');
  }

  gotoProfile(): void {
    this.router.navigateByUrl('/settings/user/profile');
  }

  /**
   * Call header item action callback
   * @param item HeaderItem to call action on
   *
   * @returns void
   */
  private callHeaderItemAction(item: HeaderItem): void {
    item.action(item);
  }

  /**
   * navigates using ANgular router an interval link
   * @param link string link to navigate to
   *
   * @returns void
   */
  private navigateInternalLink(link: string): void {
    this.router.navigateByUrl(link);
  }
}
