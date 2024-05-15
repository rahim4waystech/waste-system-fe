import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-job-signoff-land',
  templateUrl: './job-signoff-land.component.html',
  styleUrls: ['./job-signoff-land.component.scss']
})
export class JobSignoffLandComponent implements OnInit {

  activeTab: string = 'transport';
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.activeTab = localStorage.getItem('WS_MJL_TAB_SIGNOFF_LAND');

    if(!this.activeTab || this.activeTab === '') {
      this.activeTab = 'transport';
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
      if(event.url.indexOf('job-signoff/land') !== -1) {
        if(!this.activeTab || this.activeTab === '') {
          this.activeTab = 'transport';
        }
      }
    });
  }

  onTabClicked($event) {
    if($event.title.indexOf('Transport') !== -1) {
      this.activeTab = 'transport';
    } else {
      this.activeTab = 'manager';
    }
    localStorage.setItem('WS_MJL_TAB_SIGNOFF_LAND', this.activeTab);
  }
}
