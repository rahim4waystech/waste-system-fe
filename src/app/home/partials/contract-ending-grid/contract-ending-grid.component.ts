import { Component, OnInit, Input } from '@angular/core';
import { DashboardItemsService } from '../../services/dashboard-items.service';
import { catchError, take } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { DashboardStateServiceService } from '../../services/dashboard-state-service.service';

@Component({
  selector: 'app-contract-ending-grid',
  templateUrl: './contract-ending-grid.component.html',
  styleUrls: ['./contract-ending-grid.component.scss']
})
export class ContractEndingGridComponent implements OnInit {
  @Input()
  startDate:'';
  @Input()
  endDate:'';

  contractEnding:any = [];
  errorReport: boolean = false;
  errorMessage: string = '';

  constructor(
    private dashboardItemsService: DashboardItemsService,
    private router:Router,
    private dashboardStateService: DashboardStateServiceService
  ) { }

  ngOnInit(): void {
    this.dashboardStateService.$datesChanged.subscribe(()=>{
      this.loadContent();
    })

    this.loadContent();
  }

  loadContent(){
    this.dashboardItemsService.getEndingContractsForDateRange(this.startDate)
    .pipe(catchError((e)=>{
      this.errorReport = true;
      this.errorMessage = e;
      return e;
    }))
    .pipe(take(1))
    .subscribe((data:any)=>{
      this.contractEnding = data;
    })
  }

  parseDate(date:string){
    return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  clickedLink(id:number){
    this.router.navigateByUrl('/contracts/edit/'+id);
  }

}
