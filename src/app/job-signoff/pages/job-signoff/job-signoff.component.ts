import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Order } from 'src/app/order/models/order.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-signoff',
  templateUrl: './job-signoff.component.html',
  styleUrls: ['./job-signoff.component.scss']
})
export class JobSignoffComponent implements OnInit {


  constructor(private router: Router) {
  }
  ngOnInit() {
    // if it's ynd redirect back to land services signoff to plug this out till we get a more correct solution.
    if(environment.invoicing.companyName === 'Yuill & Dodds Ltd') {
      this.router.navigateByUrl('/job-signoff/start');
    }
  }


}
