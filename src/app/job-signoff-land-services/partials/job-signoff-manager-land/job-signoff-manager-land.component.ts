import { Component, OnInit, ViewChild } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Order } from 'src/app/order/models/order.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { take, catchError } from 'rxjs/operators';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { AfterViewInit } from '@angular/core';
import { InvoiceItem } from 'src/app/invoice/models/invoice-item.model';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { SubcontractorService } from 'src/app/subcontractor/services/subcontractor.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { JobSignoffLandStateService } from '../../services/job-signoff-land-state.service';
import { TipTicketService } from '../../services/tip-ticket.service';
import { TipTicket } from '../../models/tip-ticket.model';
declare var $: any;

@Component({
  selector: 'app-job-signoff-manager-land',
  templateUrl: './job-signoff-manager-land.component.html',
  styleUrls: ['./job-signoff-manager-land.component.scss']
})
export class JobSignoffManagerLandComponent implements OnInit, AfterViewInit {

  accounts: Account[] = [];
  subcontractors: Subcontractor[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  email: any = {email: ''};
  currentJob: any = {id: -1} as any;
  tips: Account[] = [];
  sites: Account[] = [];

  showPriceWarning: boolean = false;
  constructor(private invoiceService: InvoiceService,
    private accountService: AccountService,
    private jobSignoffLandStateService: JobSignoffLandStateService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private modalService: ModalService,
    private tipTicketService: TipTicketService,
    private subcontractorService: SubcontractorService,
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService) { }

  ngOnInit(): void {

    this.jobSignoffLandStateService.$editJobDialogClosed.subscribe(() => {
      this.gridComponent.getRecordsForEntity();
    });

    this.accountService.getAllAccountsForCustomerAndProspect()
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
      alert('Could not load tips');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.tips = accounts;
    });

    this.subcontractorService.getAllSubcontractors()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load subbies');
      return e;
    }))
    .subscribe((subcontractors: Subcontractor[]) => {
      this.subcontractors = subcontractors;
    });

    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load subbies');
      return e;
    }))
    .subscribe((vehicles: any) => {
      this.vehicles = vehicles;
    });

    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load drivers');
      return e;
    }))
    .subscribe((drivers: any) => {
      this.drivers = drivers;
    });

  }

  loadSites(accountId: number=-1) {
    this.accountService.getAllSitesForAccount(accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load sites');
      return e;
    }))
    .subscribe((sites: Account[]) => {
      this.sites = sites;
    })
  }

  setEmail() {
    this.email.email = this.selectedJobs[0].order.account.email;
  }
  ngAfterViewInit() {
    // force component to recreate tasty hack
    this.route.params.pipe(take(1)).subscribe(val => {
      this.selectedJobs = [];
      this.gridComponent.selectedRecords = [];
      if(localStorage.getItem('MJL_LAND_SIGNOFF_MAN_SEARCH') !== '') {
        this.searchFilters = JSON.parse(localStorage.getItem('MJL_LAND_SIGNOFF_MAN_SEARCH'));

        if(this.searchFilters === null || this.searchFilters === undefined || this.searchFilters === '') {
          this.searchFilters = {};
        }
        this.search();
      }

      if(localStorage.getItem('WS_JOB_MANAGER_SIGNOFF_LAND_SELECTED') !== '') {

        let selectedJobs = JSON.parse(localStorage.getItem('WS_JOB_MANAGER_SIGNOFF_LAND_SELECTED'));;

        if(selectedJobs) {

          let jobIds = selectedJobs.map(sj => sj.id);


          if(jobIds.length > 0) {

            // re-grab jobs to ensure latest
            this.jobService.getAllJobsByIdsExpanded(jobIds)
            .pipe(take(1))
            .pipe(catchError((e) => {
              if(e.status === 403 || e.status === 401){return e;}
              alert('could not load jobs');
              return e;
            }))
            .subscribe((jobs: any) => {
              this.selectedJobs = jobs;
              this.gridComponent.selectedRecords = JSON.parse(JSON.stringify(jobs));
            })
          }
        }
      }
    });

  }

  currentSignOffStatus: string = '';
  invoiceItems: InvoiceItem[] = [];
  searchFilters: any = {};
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

   statuses: string[] = [
    'N/A',
    'Not tipped',
    'Rescheduled',
    'Charges Only',
    'Transport sign off',
    'Problematic'
  ];

  orderType: string[] = [
    'Skip',
    'Trade Waste',
    'Tipper',
    'Artic',
    'Grab',
    'Concrete',
    'Sweeper'

  ]
  buttons: GridButton[] = [
    {label: 'Edit job', link: '/job-signoff/land/view/:id/manager', type: 'btn-warning'} as GridButton,
    {label: 'Print Invoice', type: 'btn-primary', trigger: (record) => this.getInvoiceId(record) !== -1, action:(button,record) => this.createPDFFile(this.getInvoiceId(record))} as GridButton,
    // { label: 'Delete', link: '/job-signoff/land/delete/:id', type: 'btn-danger', } as GridButton,
    //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Parent Job Id', field: 'order.id'} as GridColumn,
    {active: true, label: 'Date', field: 'date', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Time', field: 'order.time'} as GridColumn,
    {active: true, label: 'Account', field: 'order.account.name'} as GridColumn,
    {active: true, label: 'Site', field: 'order.site.name', value: (v,r) => this.getAddressForOrder(r.order)} as GridColumn,
    {active: true, label: 'Grade', field: 'order.grade.name', value: (v,r) => !r.order.grade.name ? 'N/A' : r.order.grade.name} as GridColumn,
    {active: true, label: 'Qty', field: 'qty', value: (v,r) => this.getQty(r)} as GridColumn,
    {active: true, label: 'Rate (£)', field: 'qty', value: (v, r) => this.getRate(r)} as GridColumn,
    {active: true, label: 'Order Type', field: 'order.orderTypeId', value: (v,r) => this.getOrdeTypeName(r.order.orderTypeId)} as GridColumn,
    {active: true, label: 'Driver', field: 'jobAssignment.driver.firstName', value: (v, r) => { if(r.jobAssignment.driverId !== -1) { return r.jobAssignment.driver.firstName + ' ' + r.jobAssignment.driver.lastName } else { return 'Subcontractor' } }} as GridColumn,
    {active: true, label: 'Vehicle', field: 'jobAssignment.vehicle.registration', value: (v, r) => { if(r.jobAssignment.vehicleId !== -1) { return r.jobAssignment.vehicle.registration } else { return 'Subcontractor' }  }} as GridColumn,
    {active: true, label: 'Subcontractor', field: 'jobAssignment.subcontractor.name', value: (v, r) => { if(r.jobAssignment.subcontractorId !== -1) { return r.jobAssignment.subcontractor.name } else { return 'N/A' } }} as GridColumn,
    {active: true, label: 'Subcontractor Reg', field: 'subcontractorReg'} as GridColumn,
    {active: true, label: 'Order type', field: 'order.orderTypeId', value: (v,r) => {
      if(v === 3) {
        return 'Tipper';
      }

      if(v === 4) {
        return 'Artic';
      }
    }} as GridColumn,
    // {active: true, label: 'Tip Site', field: 'order.tipSite.name'} as GridColumn,
    {active: true, label: 'Manager Status', field: 'jobManagerSignOff', value: (v, r) => v ? 'Signed off' : 'Not Signed off'} as GridColumn,
    {active: true, label: 'Total Cost (£)', field: 'qty', value: (v, r) => this.getTotalPrice(r)} as GridColumn,
    {active: true, label: 'Invoiced', field: 'id', value: (v, r) => {
      let invoiceItem = null;
      let output = 'Not invoiced';

      invoiceItem = this.invoiceItems.filter(ii => ii.jobId === r.id)[0];

      if(invoiceItem) {
        output = `<strong style='color:white;text-decoration: underline'><a target='_blank' style='color:white' href="/invoices/pdf/${invoiceItem.invoiceId}">View Invoice ${invoiceItem.invoiceId}</a></strong>`;
      }

      return output;

    }},
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    // {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Show approved and signed off jobs.
  // Hide deleted and pending.
  filters: GridFilter[] = [
    {
      field: 'jobSignOffStatusId',
      condition: 'in',
      value: [3,4,6]
    } as GridFilter,

    // only land jobs
    {
      field: 'order.orderTypeId',
      condition: 'in',
      value: [3,4,5,6,7,9]
    } as GridFilter,
  ]

  searchFields: any = ['date','time','order.account.name','order.containerType.name','order.site.name','order.containerSizeType.size','order.grade.name','jobAssignment.driver.firstName','jobAssignment.driver.lastName','jobAssignment.vehicle.registration'];

  searchFiltersGrid: GridSearchFilter[] = [
    {
      field: 'date',
      label: 'Date',
    } as GridSearchFilter,
    {
      field: 'time',
      label: 'Time',
    } as GridSearchFilter,
    {
      field: 'order.account.name',
      label: 'Account Name',
    } as GridSearchFilter,
    {
      field: 'order.site.name',
      label: 'Site Name',
    } as GridSearchFilter,

    {
      field: 'order.grade.name',
      label: 'Grade',
    } as GridSearchFilter,
    {
      field: 'jobManagerSignOff',
      label: 'Manager Signoff',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.driver.firstName',
      label: 'Driver First Name',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.driver.lastName',
      label: 'Driver Last Name',
    } as GridSearchFilter,
    {
      field: 'jobAssignment.vehicle.registration',
      label: 'Vehicle registration',
    } as GridSearchFilter,
  ]

  selectedJobs: any[] = [];

  getAddressForOrder(order: Order): string {
    let address: string  = '';

    if(order.site.name.trim() !== "") {
     address += ',' + order.site.name;
   }

     if(order.site.shippingAddress1.trim() !== "") {
       address += ',' + order.site.shippingAddress1;
     }

     if(order.site.shippingAddress2.trim() !== "") {
       address += ',' + order.site.shippingAddress2;
     }

     if(order.site.shippingCity.trim() !== "") {
       address += ',' + order.site.shippingCity;
     }

     if(order.site.shippingCountry.trim() !== "") {
       address += ',' + order.site.shippingCountry;
     }

     if(order.site.shippingPostCode.trim() !== "") {
       address += ',' + order.site.shippingPostCode;
     }

     return address.substring(1);
   }

   selectAll() {

    this.gridComponent.selectAllOptionHandler();
   }

   getInvoiceId(record) {
     const item = this.invoiceItems.filter(ii => ii.jobId === record.id)[0];

     if(item) {
       return item.invoiceId;
     } else {
       return -1;
     }
   }


   getRowColor(record) {

    if(record.tippingPrice) {
      if(record.tippingPrice.price <= 0) {
        return 'pink';
      }
    }

    let invoiceItem = this.invoiceItems.filter(ii => ii.jobId === record.id)[0];


    if(!record.jobManagerSignOff && (record.tippingPriceId === -1 || !record.tippingPriceId)) {
      return 'pink';
    }
    else if(record.jobManagerSignOff || invoiceItem) {
      return '#27ae60';
    }
    else {
      return '';
    }
   }
   isSighOffButtonVisible(record, button) {

    // If it's transport sign off or charges only don't show sign off button
     return !record.jobManagerSignOff;
   }

   getStatusName(statusId) {
     return this.statuses[statusId] === undefined ? 'Pending' : this.statuses[statusId];
   }


   getOrdeTypeName(orderTypeId) {
    return this.orderType[orderTypeId - 1] === undefined ? 'N/A' : this.orderType[orderTypeId - 1];
  }

  getTippingPriceValue(record) {
    if(record.tippingPrice) {
      if(record.tippingPrice.price <= 0) {
        return '<span style="color: red; font-weight:bold;">0.00<span>';
      } else {
        return record.tippingPrice.price.toFixed(2);
      }
    }
    return '<span style="color: red; font-weight:bold;">0.00<span>';

   }

   onSelfBillClicked() {
    if(this.selectedJobs.length === 0) {
      alert("You must select at least one job for self billing");
      return;
    }

    this.selectedJobs.forEach((job: Job) => {
     job.jobSignOffStatusId = 4;
     job.jobManagerSignOff = true;
    });

    this.jobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not updated jobs in database');
      return e;
    }))
    .subscribe(() => {
      alert('Selected Jobs have been set to self billed');
      this.gridComponent.getRecordsForEntity();
      this.gridComponent.onPaginationPageClicked(1);
    })
  }


  onSignOffButtonClicked() {
    if(this.selectedJobs.length === 0) {
      alert("You must select at least one job for signoff");
      return;
    }

    this.selectedJobs.forEach((job: Job) => {
     job.jobManagerSignOff = true;
    });

    this.jobService.bulkUpdateJob(this.selectedJobs)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not updated jobs in database');
      return e;
    }))
    .subscribe(() => {
      this.assignJobsToInvoice(this.selectedJobs);
    })
  }

  assignJobsToInvoice(jobs: Job[]) {
   this.invoiceService.assignJobsToInvoice(jobs)
   .pipe(take(1))
   .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
     alert('Cannot assign jobs to invoice');
     return e;
   }))
   .subscribe((data) => {
     alert('Selected Jobs have been signed off');
   })
  }

  onCheckboxSelected($event) {

  // don't double up only add if not added already
   if($event.checked) {
    if(this.selectedJobs.filter(j => j.id === $event.record.id).length === 0) {
      this.selectedJobs.push(JSON.parse(JSON.stringify($event.record)));
    }
   } else {
     this.selectedJobs = this.selectedJobs.filter(j => j.id !== $event.record.id);
   }
   localStorage.setItem('WS_JOB_MANAGER_SIGNOFF_LAND_SELECTED', JSON.stringify(this.selectedJobs));

  }

  getRate(record) {

    let invoiceItem = this.invoiceItems.filter(ii => ii.jobId === record.id)[0];

    if(invoiceItem) {
      return '&pound;' + invoiceItem.price;
    } else {
      return '&pound;' + record.order.orderLines[0].price;
    }
  }

  createInvoices() {

    // remove any previous invoiced items.
    let getInvoiceItems = (item) => { return this.invoiceItems.filter(ii => ii.jobId === item.id); };

    this.selectedJobs = this.selectedJobs.filter(sj => getInvoiceItems(sj).length === 0);


    if(this.selectedJobs.length === 0) {
      alert('You must select at least one job to invoice. These must not have been invoiced before.');
      return;
    }


    this.setEmail();
    this.openModal("createInvoiceModal");
  }

  getTotalPrice(record) {
    let total = 0;
    let invoiceItem = this.invoiceItems.filter(ii => ii.jobId === record.id)[0];

    if(invoiceItem) {
      total += invoiceItem.qty * invoiceItem.price;
      record.order.orderLines[0].qty = record.qty;
    } else {
      record.order.orderLines[0].qty = record.qty;

      record.order.orderLines.forEach((orderLine: OrderLine) => {
        total += orderLine.qty * orderLine.price;
      });
    }



    return '&pound;' + total.toFixed(2);
  }

  getQty(record) {
    let qty:any = record.order.orderLines[0];

    qty = record.order.orderLines[0].qty

    // is not loads
    if(record.order.orderLines[0].unitId !== 1) {
      qty = qty.toFixed(2);
    }


    let invoiceItem = this.invoiceItems.filter(ii => ii.jobId === record.id)[0];

    if(invoiceItem) {
      qty = invoiceItem.qty;
    }

    return qty;
  }


  getSelectedDetails() {

    this.showPriceWarning = false;

    let price = 0;
    let qty = 0;

    let prevPrice = -1;
    this.selectedJobs.forEach((job: any) => {
      qty += job.qty;
      price += job.order.orderLines[0].price * job.qty;


      if(prevPrice != -1 && prevPrice !== job.order.orderLines[0].price) {
        this.showPriceWarning = true;
      }

      prevPrice = job.order.orderLines[0].price;
    });

    // check if float if so format to 2 decimals
    if(qty % 1 != 0) {
      qty = <any>qty.toFixed(2);
    }

    return {total: this.selectedJobs.length, qty: qty, price:price.toFixed(2)};
  }

  openModal(name:string) {
    this.modalService.open(name);
  }

  createPDFFile(invoiceId) {
    const invoiceIds = [];

    const data =  {
      "invoiceIds": [invoiceId],
      "type": 1,
      "pods": false,
      "tipchecks": false,
    }

    this.invoiceService.createPDFBatchFile(data)
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not generate invoice please try again later.');
      return e;
    }))
    .subscribe((data:any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
      // refresh the page so grid is up to date
      //window.location.reload();
    })
  }

  clear() {
    this.searchFilters = {};
    this.search();
  }

  search() {
    //this.setSearchFieldOnGrid('datevehicleId', '') -dates
    this.setVehicleTypeFilter();
    this.setTicketTypeFilter();
    this.setSearchFieldOnGrid('order.site.name', this.searchFilters['site']);
    this.setSearchFieldOnGrid('order.tipSite.name', this.searchFilters['tipSite']);
    this.setSearchFieldOnGrid('subcontractorReg', this.searchFilters['subcontractorReg']);
    this.setSearchFieldOnGrid('jobAssignment.vehicle.registration', this.searchFilters['vehicle'], 'cont');
    this.setSearchFieldOnGrid('jobAssignment.driver.firstName', this.searchFilters['driver'], 'cont');
    this.setSearchFieldOnGrid('order.account.id',+this.searchFilters['customer'], 'eq');
    this.setSearchFieldOnGrid('id', this.searchFilters['jobNumber']);
    this.setSearchFieldOnGrid('order.id', this.searchFilters['parentJobId']);
    this.setSearchFieldOnGrid('order.poNumber', this.searchFilters['orderRef'], 'cont');
    this.setSearchFieldOnGrid('jobAssignment.subcontractor.name', this.searchFilters['subcontractor'], 'cont');

    this.setSignOffStatusSearch();
    this.setDateRangeFilter();
    this.setTipTicketNumberFilter();
  }

  setTicketTypeFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'transportSignOffNotes');

    if(this.searchFilters['ticketType'] && this.searchFilters['ticketType'] !== '') {
      if(this.searchFilters['ticketType'] === 'has') {
        this.gridComponent.filters.push({
          condition: 'ne',
          value: '',
          field: 'transportSignOffNotes',
        });
      } else if(this.searchFilters['ticketType'] === 'not') {
        this.gridComponent.filters.push({
          condition: 'eq',
          value: '',
          field: 'transportSignOffNotes',
        });
      }
    }

  }

  setVehicleTypeFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'jobAssignment.vehicleId');

    if(this.searchFilters['vehicleType'] && this.searchFilters['vehicleType'] !== '') {
      if(this.searchFilters['vehicleType'] === 'subcontractors') {
        this.gridComponent.filters.push({
          condition: 'eq',
          value: -1,
          field: 'jobAssignment.vehicleId',
        });
      } else if(this.searchFilters['vehicleType'] === 'own') {
        this.gridComponent.filters.push({
          condition: 'ne',
          value: -1,
          field: 'jobAssignment.vehicleId',
        });
      }
    }

  }

  setTipTicketNumberFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.condition + f.field !== 'inid');

    if(this.searchFilters['tipTicket'] && this.searchFilters['tipTicket'] !== '') {
      this.tipTicketService.getTipTicketsByCollectionNumber(this.searchFilters['tipTicket'])
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('could not load tip tickets');
        return e;
      }))
      .subscribe((tipTickets: TipTicket[]) => {

        let jobIds = tipTickets.map(j => j.jobId);


        if(jobIds.length === 0) {
          jobIds = [-1];
        }

        this.gridComponent.filters.push({
          condition: 'in',
          value: jobIds,
          field: 'id',
        });

        console.log(this.gridComponent.filters);


        this.setSignOffStatusSearch();
        localStorage.setItem('MJL_LAND_SIGNOFF_MAN_SEARCH', JSON.stringify(this.searchFilters));

        this.gridComponent.getRecordsForEntity();
        this.gridComponent.onPaginationPageClicked(1);
      });
    } else {
      this.setSignOffStatusSearch();

      localStorage.setItem('MJL_LAND_SIGNOFF_MAN_SEARCH', JSON.stringify(this.searchFilters));
      this.gridComponent.getRecordsForEntity();
      this.gridComponent.onPaginationPageClicked(1);
    }
  }

  clearSelected() {
    this.selectedJobs = [];
    this.gridComponent.selectedRecords = [];
    localStorage.setItem('WS_JOB_MANAGER_SIGNOFF_LAND_SELECTED', JSON.stringify(this.selectedJobs));
  }


  deleteAll() {
    let jobIds = this.selectedJobs.map(sj => sj.id);
    this.router.navigateByUrl('/job-signoff/land/deleteall/' + jobIds.join(','));
  }

  setDateRangeFilter() {
    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'date');
    if(this.searchFilters['startDate'] && this.searchFilters['startDate'] !== '' && this.searchFilters['endDate'] && this.searchFilters['endDate'] !== '') {
      this.gridComponent.filters.push({
        condition: 'gte',
        value: this.searchFilters['startDate'],
        field: 'date',
      });
      this.gridComponent.filters.push({
        condition: 'lte',
        value: this.searchFilters['endDate'],
        field: 'date',
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
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'jobManagerSignOff');
    if(this.searchFilters.status === 'not' || this.searchFilters.status === 'signed') {
      this.gridComponent.filters.push(
        {
          condition: 'eq',
          field: 'jobManagerSignOff',
          value: <any>(this.searchFilters.status === 'not' ? 0 : 1),
        }  as GridSelectedFilter
    );
  }
}

  setSignoffStatus(status: string) {
    this.currentSignOffStatus = status;


    if(this.currentSignOffStatus !== '') {
      this.gridComponent.selectedFilters = [
        {
          condition: 'eq',
          field: 'jobManagerSignOff',
          value: <any>(this.currentSignOffStatus === 'not' ? 0 : 1),
        }  as GridSelectedFilter
      ]
      this.gridComponent.getRecordsForEntity();
      this.gridComponent.onValueChanged();
      this.gridComponent.onPaginationPageClicked(1);
      this.clear();
    } else {
      this.gridComponent.selectedFilters = [];
      this.gridComponent.getRecordsForEntity();
      this.gridComponent.onValueChanged();
      this.gridComponent.onPaginationPageClicked(1);
      this.clear();
    }
  }

  recordUpdated(records: Job[]) {
    let ids = [];

    records.forEach((record:any) => {
      ids.push(record.id);
    });

    this.invoiceService.findInvoiceItemsForJobs(ids)
    .pipe(take(1))
    .pipe(catchError((e) => {
     // alert('could not load invoiceItems');
      return e;
    }))
    .subscribe((items: any) => {
      this.invoiceItems = items;
    });
  }

  getHoverText(record) {
    return 'Job ID: ' + record.id + ' Tickets: ' + record.transportSignOffNotes + ' Order REF: ' + record.order.poNumber + ' Tip Site: ' + record.order.tipSite.name + ' Product Details: ' + record.order.orderLines[0].name;
  }

}
