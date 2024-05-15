import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-job-signoff-start',
  templateUrl: './job-signoff-start.component.html',
  styleUrls: ['./job-signoff-start.component.scss']
})
export class JobSignoffStartComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  isYND() {
    return environment.invoicing.companyName === 'Yuill & Dodds Ltd';
  }

}
