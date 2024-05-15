import { Component, OnInit, Input } from '@angular/core';
import { DashboardItemsService } from '../../services/dashboard-items.service';
import { DashboardStateServiceService } from '../../services/dashboard-state-service.service';
import { Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-gross-profit-by-salesman-graph',
  templateUrl: './gross-profit-by-salesman-graph.component.html',
  styleUrls: ['./gross-profit-by-salesman-graph.component.scss']
})
export class GrossProfitBySalesmanGraphComponent implements OnInit {
  @Input()
  startDate:'';
  @Input()
  endDate:'';

  errorReport: boolean = false;
  errorMessage: string = '';

  dataPie = [
    {"name": "Linda Shirt","value": 347978},
    {"name": "Peter Petersson","value": 32552},
    {"name": "Brian Onions","value": 365434},
    {"name": "The Janet","value": 24566}
  ];

  view: any[] = [];
  gradient: boolean = false;
  showLegendPie: boolean = true;
  legendPosition: string = 'below';
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };



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
    this.dashboardItemsService.getSalesPerPerson(this.startDate,this.endDate)
    .pipe(catchError((e)=>{
      this.errorReport = true;
      this.errorMessage = e;
      return e;
    }))
    .pipe(take(1))
    .subscribe((data:any)=>{
    })
  }

}
