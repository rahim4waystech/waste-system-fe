import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Account } from 'src/app/order/models/account.model';
import { MaterialUpliftTicket } from 'src/app/order/models/material-uplift-ticket.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { MaterialUpliftTicketService } from '../../services/material-uplift-ticket.service';

@Component({
  selector: 'app-job-signoff-material-uplift',
  templateUrl: './job-signoff-material-uplift.component.html',
  styleUrls: ['./job-signoff-material-uplift.component.scss']
})
export class JobSignoffMaterialUpliftComponent implements OnInit, AfterViewInit{

  selectedTickets: MaterialUpliftTicket[] = [];
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  buttons: GridButton[] = [
    {label: 'Edit', link: '/job-signoff/material-uplift/edit/:id', type: 'btn-warning',} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Job', field: 'jobId', value: (v, r) => {
      return `<strong style='color:black;text-decoration: underline'><a style='color:black' href="/job-signoff/land/view/${r.jobId}">View Job ${r.jobId}</a></strong>`;

    }},
    {active: true, label: 'Job Date', field: 'job.date'} as GridColumn,
    {active: true, label: 'Vehicle', field: 'job.jobAssignment.vehicle.registration', value: (v, r) => { if(r.job.jobAssignment.vehicleId !== -1) { return r.job.jobAssignment.vehicle.registration } else { return 'Subcontractor' }  }} as GridColumn,
    {active: true, label: 'Subcontractor', field: 'job.jobAssignment.subcontractor.name', value: (v, r) => { if(r.job.jobAssignment.subcontractorId !== -1) { return r.job.jobAssignment.subcontractor.name } else { return 'N/A' } }} as GridColumn,
    {active: true, label: 'Subcontractor Reg', field: 'job.subcontractorReg'} as GridColumn,
    {active: true, label: 'Customer', field: 'account.name'} as GridColumn,
    {active: true, label: 'Tip Site', field: 'job.order.tipSite.name'} as GridColumn,
    {active: true, label: 'Collection Ticket Number', field: 'ticketNumber'} as GridColumn,
    {active: true, label: 'Cost', field: 'price'} as GridColumn,
    {active: true, label: 'Qty', field: 'qty'} as GridColumn,
    {active: true, label: 'Unit', field: 'unit.name'} as GridColumn,
    {active: true, label: "Supplier Invoice Number", field: 'supplierInvoiceNumber'} as GridColumn,
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = [];

  searchFilters: any = {};
  customSearchFilters: any = {};

  tips: Account[] = [];
  accounts: Account[] = [];
  subcontractors: Subcontractor[] =  [];
  vehicles: Vehicle[] = [];
  supplierInvoiceNumber: string = '';

  constructor(private materialUpliftTicketService: MaterialUpliftTicketService,
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private subcontractorService: SubcontractorService,
    private accountService: AccountService) { }

  ngAfterViewInit() {
    this.route.params.subscribe(val => {
      if (localStorage.getItem('MJL_GRID_MATERIAL_UPLIFT_FILTERS') !== '') {
        this.searchFilters = JSON.parse(localStorage.getItem('MJL_GRID_MATERIAL_UPLIFT_FILTERS'));

        if (this.searchFilters === null || this.searchFilters === undefined || this.searchFilters === '') {
          this.searchFilters = {};
        }
        this.search();
      }
    });

  }
  ngOnInit(): void {


    this.subcontractorService.getAllSubcontractors()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load subcontractors');
      return e;
    }))
    .subscribe((accounts: Subcontractor[]) => {
      this.subcontractors = accounts;
    });

    this.accountService.getAllAccounts()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load customers');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.accounts = accounts;
    });


    this.accountService.getAllTips()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load all tips');
      return e;
    }))
    .subscribe((tips: any) => {
      this.tips = tips;
    })

    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load vehicles');
      return e;
    }))
    .subscribe((vehicles: Vehicle[]) => {
      this.vehicles = vehicles;
    })
  }

  getRecords(grid: GridComponent) {
    const page = grid.newPage;
    const amount = grid.amount;

    return this.materialUpliftTicketService.getGrid(page, amount, this.searchFilters);
  }


  clear() {
    this.searchFilters = {};
    this.search();
  }

  search() {
    localStorage.setItem('MJL_GRID_MATERIAL_UPLIFT_FILTERS', JSON.stringify(this.searchFilters));
    this.gridComponent.getRecordsForEntity();
    this.gridComponent.onPaginationPageClicked(1);
  }


  clearSelected() {
    this.selectedTickets = [];
    this.gridComponent.selectedRecords = [];
    // localStorage.setItem('WS_TIP_TICKET_SELECTED', JSON.stringify(this.selectedTickets));
  }

  onSignOffButtonClicked() {
    if(this.selectedTickets.length === 0) {
      alert("You must select at least one job for signoff");
      return;
    }

    this.selectedTickets.forEach((ticket: MaterialUpliftTicket) => {
     ticket.signedOff = true;
     ticket.supplierInvoiceNumber = this.supplierInvoiceNumber;
    });

    this.supplierInvoiceNumber = '';

    this.materialUpliftTicketService.bulkUpdateTickets(this.selectedTickets)
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
    })
  }

   onCheckboxSelected($event) {
    if($event.checked) {
      this.selectedTickets.push($event.record);
    } else {
      this.selectedTickets = this.selectedTickets.filter(j => j.id !== $event.record.id);
    }
   }

   getRowColor(record) {
    if(record.signedOff) {
      return '#27ae60';
    }
    else {
      return '';
    }


   }

   setDateRangeFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'job.date');
    if(this.customSearchFilters['startDate'] && this.customSearchFilters['startDate'] !== '' && this.customSearchFilters['endDate'] && this.customSearchFilters['endDate'] !== '') {
      this.gridComponent.filters.push({
        condition: 'gte',
        value: this.customSearchFilters['startDate'],
        field: 'job.date',
      });
      this.gridComponent.filters.push({
        condition: 'lte',
        value: this.customSearchFilters['endDate'],
        field: 'job.date',
      });
    }
  }

  setSearchFieldOnGrid(fieldName, value, operator='eq') {

    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== fieldName);
    if(value && value !== '') {
      this.gridComponent.filters.push({
        condition: operator,
        value: value,
        field: fieldName,
      })
    }
  }

  setSignOffStatusSearch() {
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'signedOff');


    if(this.customSearchFilters.status === 'not' || this.customSearchFilters.status === 'signed') {
      this.gridComponent.filters.push(
        {
          condition: 'eq',
          field: 'signedOff',
          value: <any>(this.customSearchFilters.status === 'not' ? 0 : 1),
        }  as GridSelectedFilter
    );
  }
}

getSelectedDetails() {

  let price = 0;
  let qty = 0;

  this.selectedTickets.forEach((ticket: MaterialUpliftTicket) => {
    qty += ticket.qty;
    price += ticket.price * ticket.qty;
  });

  return {total: this.selectedTickets.length, qty: qty.toFixed(2), price:price.toFixed(2)};
}


}
