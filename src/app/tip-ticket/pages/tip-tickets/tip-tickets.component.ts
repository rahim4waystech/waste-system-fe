import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { GridFilter } from 'src/app/core/models/gird-filter.model';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { TipTicket } from 'src/app/job-signoff-land-services/models/tip-ticket.model';
import { TipTicketService } from 'src/app/job-signoff-land-services/services/tip-ticket.service';
import { Account } from 'src/app/order/models/account.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';

@Component({
  selector: 'app-tip-tickets',
  templateUrl: './tip-tickets.component.html',
  styleUrls: ['./tip-tickets.component.scss']
})
export class TipTicketsComponent implements OnInit, AfterViewInit {

  selectedTickets: TipTicket[] = [];
  searchFilters: any = {};

  accounts: Account[] = [];
  tips: Account[] = [];
  supplierInvoiceNumber: string = '';
  subcontractors: Subcontractor[] = [];
  vehicles: Vehicle[] = [];

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;


  buttons: GridButton[] = [
    {label: 'Edit', link: '/tip-ticket/edit/:id', type: 'btn-warning',} as GridButton,
    {label: 'Delete', link: '/tip-ticket/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    // {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Job', field: 'jobId', value: (v, r) => {
      return `<strong style='color:black;text-decoration: underline'><a style='color:black' href="/job-signoff/land/view/${r.jobId}">View Job ${r.jobId}</a></strong>`;
      
    }},
    {active: true, label: 'Job Date', field: 'job.date', value: (v, r) => moment(r.job.date).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Vehicle', field: 'job.jobAssignment.vehicle.registration', value: (v, r) => { if(r.job.jobAssignment.vehicleId !== -1) { return r.job.jobAssignment.vehicle.registration } else { return 'Subcontractor' }  }} as GridColumn,
    {active: true, label: 'Subcontractor', field: 'job.jobAssignment.subcontractor.name', value: (v, r) => { if(r.job.jobAssignment.subcontractorId !== -1) { return r.job.jobAssignment.subcontractor.name } else { return 'N/A' } }} as GridColumn,
    {active: true, label: 'Subcontractor Reg', field: 'job.subcontractorReg'} as GridColumn,
    {active: true, label: 'Customer', field: 'job.order.account.name', value: (v, r) => r.job !== null ? r.job.order.account.name : 'N/A'} as GridColumn,
    {active: true, label: 'Tip Site', field: 'job.order.tipSite.name'} as GridColumn,
    {active: true, label: 'Collection Ticket', field: 'collectionTicketNumber'} as GridColumn,
    {active: true, label: "Cost", field: 'price'} as GridColumn,
    {active: true, label: "Qty", field: 'qty'} as GridColumn,
    {active: true, label: "Unit", field: 'unit.name'} as GridColumn,
    {active: true, label: "Supplier Invoice Number", field: 'supplierInvoiceNumber'} as GridColumn,
    // {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    // {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  constructor(private tipTicketService: TipTicketService,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private subcontractorService: SubcontractorService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getAllAccountsForCustomerAndProspect()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load customers');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.accounts = accounts;
    });


    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load subbies');
      return e;
    }))
    .subscribe((vehicles: any) => {
      this.vehicles = vehicles;
    });

    this.subcontractorService.getAllSubcontractors()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load subcontractors');
      return e;
    }))
    .subscribe((subcontractors: Subcontractor[]) => {
      this.subcontractors = subcontractors;
    });


    this.accountService.getAllTips()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load tips');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.tips = accounts;
    });
  }

  clearSelected() {
    this.selectedTickets = [];
    this.gridComponent.selectedRecords = [];
    localStorage.setItem('WS_TIP_TICKET_SELECTED', JSON.stringify(this.selectedTickets));
  }

  selectAll() {
    this.gridComponent.selectAllOptionHandler();
  }
  getRowColor(record) {
    if(record.isSignedOff) {
      return '#27ae60';
    }
    else {
      return '';
    }
   }

   onSignOffButtonClicked() {
    if(this.selectedTickets.length === 0) {
      alert("You must select at least one job for signoff");
      return;
    }

    this.selectedTickets.forEach((ticket: TipTicket) => {
     ticket.isSignedOff = true;
     ticket.supplierInvoiceNumber = this.supplierInvoiceNumber;
    });

    this.supplierInvoiceNumber = '';

    this.tipTicketService.bulkUpdateTickets(this.selectedTickets)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not updated tickets in database');
      return e;
    }))
    .subscribe(() => {
      // refresh grid.
      alert('Tickets have been signed off');
      this.selectedTickets = [];
      this.gridComponent.selectedRecords = [];
      localStorage.setItem('WS_TIP_TICKET_SELECTED', JSON.stringify(this.selectedTickets));
    })
  }

   onCheckboxSelected($event) {
    if($event.checked) {
      this.selectedTickets.push(JSON.parse(JSON.stringify($event.record)));
    } else {
      this.selectedTickets = this.selectedTickets.filter(j => j.id !== $event.record.id);
    }

    localStorage.setItem('WS_TIP_TICKET_SELECTED', JSON.stringify(this.selectedTickets));
   }

   clear() {
    this.searchFilters = {};
    this.search();
  }

  search() {
    //this.setSearchFieldOnGrid('date', '') -dates

    localStorage.setItem('MJL_GRID_TIP_TICKET_FILTERS', JSON.stringify(this.searchFilters));

    this.gridComponent.getRecordsForEntity();
    this.gridComponent.onPaginationPageClicked(1);
  }


  ngAfterViewInit() {
    // force component to recreate tasty hack
    this.route.params.subscribe(val => {
      if (localStorage.getItem('MJL_GRID_TIP_TICKET_FILTERS') !== '') {
        this.searchFilters = JSON.parse(localStorage.getItem('MJL_GRID_TIP_TICKET_FILTERS'));

        if (this.searchFilters === null || this.searchFilters === undefined || this.searchFilters === '') {
          this.searchFilters = {};
        }
        this.search();
      }

      if(localStorage.getItem('WS_TIP_TICKET_SELECTED') !== '') {

        // restore selected tickets
        let selectedJobs = JSON.parse(localStorage.getItem('WS_TIP_TICKET_SELECTED'));

        if(selectedJobs) {
          this.selectedTickets = selectedJobs;
          this.gridComponent.selectedRecords = JSON.parse(JSON.stringify(this.selectedTickets));
        }
      }

    });

  }


getRecords(grid: GridComponent) {
  const page = grid.newPage;
  const amount = grid.amount;
  
  return this.tipTicketService.getGrid(page, amount, this.searchFilters);
}


getSelectedDetails() {

  let price = 0;
  let qty = 0;

  this.selectedTickets.forEach((tipTicket: TipTicket) => {
    qty += tipTicket.qty;
    price += tipTicket.price * tipTicket.qty;
  });

  return {total: this.selectedTickets.length, qty: qty, price:price.toFixed(2)};
}




}
