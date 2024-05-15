import { Component, OnInit } from '@angular/core';
import { DashboardItemsService } from '../../services/dashboard-items.service';
import { Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-last-order-date-grid',
  templateUrl: './last-order-date-grid.component.html',
  styleUrls: ['./last-order-date-grid.component.scss']
})
export class LastOrderDateGridComponent implements OnInit {

  errorReport: boolean = false;
  errorMessage: string = '';

  noOrders: any = [];
  selectedPeriod: number = 1;

  constructor(
    private dashboardItemsService: DashboardItemsService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.loadContent(this.selectedPeriod);
  }

  changedPeriod(event){
    this.selectedPeriod = parseInt(event.target.value,10);

    this.loadContent(this.selectedPeriod)
  }

  loadContent(period){
    const periodStart = moment().subtract(period,'M').format('YYYY-MM-DD');
    const periodEnd = moment().format('YYYY-MM-DD');
    this.dashboardItemsService.getNoOrdersForPeriod(periodStart,periodEnd)
    .pipe(catchError((e)=>{
      this.errorReport = true;
      this.errorMessage = e;
      return e;
    }))
    .pipe(take(1))
    .subscribe((data:any)=>{
      this.noOrders = data;
    })
  }

  parseDate(date:string){
    return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  clickedLink(id:number){
    this.router.navigateByUrl('/orders/edit/'+id);
  }

}
