import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { OrderType } from 'src/app/order/models/order-type.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { TippingPrice } from 'src/app/account/models/tipping-price.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { OrderService } from 'src/app/order/services/order.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { AccountService } from 'src/app/account/services/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderValidatorService } from 'src/app/order/validators/order-validator.service';
import { JobSignOffValidatorService } from 'src/app/job-signoff/validators/job-signoff-validator.service';
import { catchError, take } from 'rxjs/operators';
import { JobStatus } from 'src/app/timeline-skip/models/job-status.model';
import { PodService } from 'src/app/pods/services/pod.service';
import { DriverJobMovement } from 'src/app/pods/models/driver-job-movement.model';
import { Grade } from 'src/app/container/models/grade.model';
import { ContainerService } from 'src/app/container/services/container.service';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { Unit } from 'src/app/order/models/unit.model';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { InvoiceItem } from 'src/app/invoice/models/invoice-item.model';
import * as moment from 'moment';
import { truncate } from 'fs';
import { TipTicket } from '../../models/tip-ticket.model';
import { TipTicketService } from '../../services/tip-ticket.service';
import { Account } from 'src/app/order/models/account.model';
import { environment } from 'src/environments/environment';
import { MaterialUplift } from 'src/app/order/models/material-uplift.model';
import { MaterialUpliftTicket } from 'src/app/order/models/material-uplift-ticket.model';
import { MaterialUpliftTicketService } from 'src/app/job-signoff-material-uplift/services/material-uplift-ticket.service';
import { SimpleChanges } from '@angular/core';
import { JobSignoffLandStateService } from '../../services/job-signoff-land-state.service';

@Component({
  selector: 'app-job-signoff-land-view',
  templateUrl: './job-signoff-land-view.component.html',
  styleUrls: ['./job-signoff-land-view.component.scss']
})
export class JobSignoffLandViewComponent implements OnInit {
  job: any = new Job()
  types: OrderType[] = [];
  tips: Account[] = [];
  pods: DriverJobMovement[] = [];
  grades: Grade[] = [];
  uplifts: MaterialUplift[] = [];
  upliftTickets: MaterialUpliftTicket[] = [];

  orderLines: OrderLine[] = [];
  orderLinesOriginal: OrderLine[] = [];

  isSaveDisabled: boolean = false;

  isServerError: boolean = false;

  isAllWeightsSupplied: boolean = false;


  showAdditionalDetails: boolean = false;

  isError: boolean = false;
  units: Unit[] = [];

  @Input()
  mode: string = 'transport';

  invoiceItem: InvoiceItem = new InvoiceItem();

  startTime: string = '';
  endTime: string = '';
  breakTime: number = 0;
  waitingTime:number= 0;
  travelTime: number = 0;

  weights: string = '';

  tipTickets: TipTicket[] = [];

  @Input()
  jobId: any = {id: -1};

  @Input()
  isPopup: boolean = false;


  constructor(private jobService: JobService,
    private orderService: OrderService,
    private modalService: ModalService,
    private invoiceService: InvoiceService,
    private accountService: AccountService,
    private tipTicketService: TipTicketService,
    private materialUpliftTicketService: MaterialUpliftTicketService,
    private podService: PodService,
    private router: Router,
    private jobSignoffLandStateService: JobSignoffLandStateService,
    private containerService: ContainerService,
    private orderValidator: OrderValidatorService,
    private jobValidator: JobSignOffValidatorService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {

        if(!this.isPopup) {
          this.loadJob(+params['id']);
        }

      if(params['mode'] && this.jobId.id === -1) {
        this.mode = 'manager';
      }
    })

    this.jobSignoffLandStateService.$jobIdChanged.subscribe((jobId: number) => {
      this.loadJob(jobId);
    });

    this.orderService.getAllOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: OrderType[]) => {
      this.types = types;
    });

    this.containerService.getAllGrades()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('grades could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((grades: any) => {
      this.grades = grades;
    });


    this.orderService.getAllUnits()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('units could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((units: any) => {
      this.units = units;
    });

    this.accountService.getAllAccounts()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('tips could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((tips: Account[]) => {
      this.tips = tips;
    });


  }


  setWeight() {
    const weights = this.weights.split('/');
    let totalWeight = 0;

    weights.forEach((weight) => {
      totalWeight += +weight;
    })

    if(this.orderLines[0]) {
      this.orderLines[0].qty = totalWeight.toFixed(2) as any;
    }


    if(weights.length < this.job.transportSignOffNotes.split('/').length ) {
      this.isAllWeightsSupplied = true;
    } else {
      this.isAllWeightsSupplied = false;
    }

  }
  setHours() {
    const endDateValue = this.endTime < this.startTime ? '2021-01-02' : '2021-01-01';

    const startDate = moment('2021-01-01 ' + this.startTime);
    const endDate = moment(endDateValue + ' ' + this.endTime);

    const duration = moment.duration(endDate.diff(startDate));

    if(this.orderLines[0]) {
      this.orderLines[0].qty = duration.subtract(this.breakTime + this.waitingTime, 'minutes').add(this.travelTime, 'minutes').asHours();

    }

  }


  deleteOrderLine(orderLineId: number=-1) {
    if(confirm("are you sure you wish to delete this item?")) {
      this.orderService.deleteOrderLine(orderLineId)
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        this.orderLines = this.orderLines.filter(o => o.id !== orderLineId);
        this.orderLinesOriginal = this.orderLinesOriginal.filter(o => o.id !== orderLineId);
      })
    }
  }

  loadOrderLines() {
    this.orderService.getOrderLinesByOrderId(this.job.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((orderLines: OrderLine[]) => {
      this.orderLines = orderLines;
      this.orderLinesOriginal = JSON.parse(JSON.stringify(this.orderLines));

      let primaryCharge = this.orderLines.filter(ol => ol.isPrimaryCharge)[0];

      if(!primaryCharge) {
        primaryCharge = this.orderLines[0];
      }

      primaryCharge.qty = this.job.qty;

      this.loadPODS();
      this.loadMaterialUplifts();


    })
  }

  loadMaterialUplifts() {
    this.orderService.getUpliftsByOrderId(this.job.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load uplifts');
      return e;
    }))
    .subscribe((uplifts: any) => {
      this.uplifts = uplifts;
      this.loadMaterialUpLiftTickets();
    })

  }

  loadMaterialUpLiftTickets() {
    this.materialUpliftTicketService.getAllTicketsByJobId(this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load uplift tickets');
      return e;
    }))
    .subscribe((tickets:any) => {
      this.upliftTickets = tickets;

      if(this.upliftTickets.length === 0) {
        this.generateUpliftTicketsFromUplifts();
      }
    });
  }

  loadInvoiceItem(jobId: number) {
    this.invoiceService.findInvoiceItemForJobId(this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not find invoice item for jobId');
      return e;
    }))
    .subscribe((item: any) => {
      this.invoiceItem = item;

      this.invoiceItem = this.invoiceItem[0];

      // Have invoice itme is disabled.
      if(this.invoiceItem !== null && this.invoiceItem !== undefined) {
        if(this.invoiceItem.id !== -1) {
          this.isSaveDisabled = true;

          // set invoiced value for job
          if( this.orderLines.length > 0) {
            this.orderLines[0].price = this.invoiceItem.price;
          }
        }

      }
    })
  }

  loadJob(jobId: number) {

    // If transport sign off make job signed off
    if(this.job.jobSignOffStatusId === 4) {
      this.job.jobStatusId = 4;
    }

    this.jobService.getJobById(jobId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Job could not be loaded')
      return e;
    }))
    .subscribe((job: Job) => {
      this.job = job;
      // If it's not tipped or transport sign off
      if([1, 4].indexOf(this.job.jobSignOffStatusId) !== -1) {
        this.showAdditionalDetails = true;
      }

      this.weights = this.job.weightNotes;

      this.loadTippingPrice();
      this.loadOrderLines();
      this.loadInvoiceItem(this.job.id);
    })
  }

  loadPODS() {
    this.podService.getPodsByJobId(this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load pods');
      return e;
    }))
    .subscribe((pods: DriverJobMovement[]) => {
      this.pods = pods;
      let podAmount = 0;

      pods.forEach((pod: DriverJobMovement) => {
        podAmount += pod.qty;
      });

      if(podAmount > 0 && !this.job.jobManagerSignOff) {
        this.job.qty = podAmount.toFixed(2);
      }

    })

    // this.setQtyTotal();
    this.loadTickets();
  }

  loadTickets() {
    this.tipTicketService.getAllTicketsByJobId(this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      return e;
    }))
    .subscribe((tickets: any) => {
      this.tipTickets = tickets;
      this.createTickets();
    });
  }

  loadTippingPrice() {

    if(this.job.order.tipSiteId === -1 || !this.job.order.tipSiteId || this.job.order.gradeId === -1 || !this.job.order.gradeId) {
      return;
    }

    this.accountService.getTipPriceForSiteAndGrade(this.job.order.tipSiteId, this.job.order.gradeId, this.job.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      // alert('could not load tipping price');
      return e;
    }))
    .subscribe((data) => {

      const tippingPrice = data[0];

      if(tippingPrice) {
        this.job.tippingPriceId = tippingPrice.id;
      }
    })
  }

  openModal(modalName: string) {
    this.modalService.open(modalName);
  }

  onStatusChanged($event) {
    this.job.jobSignOffStatusId = +$event.target.value;


    this.showAdditionalDetails = false;


    if(this.job.jobSignOffStatusId === 2) {
      this.openModal('jobSignOffRescheduleModal');
    }

    // Selected charges only
    if(this.job.jobSignOffStatusId === 3) {
      this.openModal('jobSignOffChargesOnlyModal');
    }


    // If it's not tipped or transport sign off or wasted only
    if([1,3, 4].indexOf(this.job.jobSignOffStatusId) !== -1) {
      this.showAdditionalDetails = true;
    }
  }


  save() {


    if((!this.orderValidator.isDataValid(this.job.order, null) || !this.jobValidator.isValid(this.job))) {
      this.isError = true;
      return;
    }

      this.saveOrder();

  }

  getTotalPriceForOrderLine(orderLine: OrderLine): number {
    if(!orderLine) {
      throw new Error('orderline must be provided in order form for total price');
    }

    return orderLine.price * orderLine.qty;
  }


  saveJob() {

//    if(this.job.jobSignOffStatusId === 4) {

      // Stop status change if timeline

      if(!this.isPopup) {
        this.job.jobStatusId = 4;
        this.job.jobStatus = {id: 4} as JobStatus;
      } else if(this.isPopup) {
        if(this.job.jobSignOffStatusId === 4) {
          this.job.jobStatusId = 4;
          this.job.jobStatus = {id: 4} as JobStatus;
        }
      }
//    }

    // set job qty based on order
    this.job.qty = this.orderLines[0].qty;

    // save weights in db
    this.job.weightNotes = this.weights;

    this.jobService.updateJob(this.job)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save job. please try again later');
      return e;
    }))
    .subscribe(() => {
      this.createNewOrderLines();
    })
  }

  saveOrder() {
    this.orderService.updateOrder(this.job.order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save order. please try again later');
      return e;
    }))
    .subscribe(() => {
      this.saveJob();
    })
  }

  createNewOrderLines(): void {

    const orderlinesSave = this.orderLines.filter(o => o.qty > 0);

    orderlinesSave.forEach(orderLine => {
      orderLine.order.id = this.job.order.id;
      orderLine.orderId = this.job.order.id;
      // orderLine.id = -1;

    });

    // this.orderLinesOriginal[0].id = -1;


    // Default keep order line same for order
    orderlinesSave[0] = JSON.parse(JSON.stringify(orderlinesSave[0]));

    this.orderLines.forEach((line: OrderLine) => {
      line.quoteLine = {id: line.quoteLineId} as any;
    });

    this.orderLinesOriginal.forEach((line: OrderLine) => {
      line.quoteLine = {id: line.quoteLineId} as any;
    });

    // retain price or set it up for a sep price for this job only
    if(this.job.overridePrice) {
      this.job.newPrice = this.orderLines[0].price;
    }
    else {
      this.orderLinesOriginal[0].price = this.orderLines[0].price;
    }

    this.orderLines[0] = this.orderLinesOriginal[0];

    this.bulkSaveOrderLines(this.orderLines);

    // this.orderService.deleteOrderLinesForOrderId(this.job.order.id)
    // .pipe(take(1))
    // .pipe(catchError((e) => {
    //   this.isServerError = true;
    //   return e;
    // }))
    // .subscribe(() => {
    //   // get orderlines supplied

    // })
  }

  close(){

    this.modalService.close('jobSignOffLandEditJobModal');
    return false;
  }
  redirect() {

    if(this.isPopup) {
      this.modalService.close('jobSignOffLandEditJobModal');
      this.jobSignoffLandStateService.$editJobDialogClosed.next(true);
      return;
    }
    const signoffList = localStorage.getItem('WS_MJL_LAND_SIGNOFF_LIST');
      if(!signoffList || signoffList === "") {
        this.router.navigateByUrl('/job-signoff/land');
      } else {
        const signOffListObj = JSON.parse(signoffList);
        signOffListObj.splice(0, 1);
        if(signOffListObj.length !== 0) {
          const url = "/job-signoff/land/view/" + signOffListObj[0].id;
          localStorage.setItem('WS_MJL_LAND_SIGNOFF_LIST', JSON.stringify(signOffListObj));
          window.location.href = url;
        } else {
          this.router.navigateByUrl('/job-signoff/land');
        }
      }
  }
  assignJobsToInvoice() {


    // KEEP THIS DISABLED FOR NOW
    if(true) {
      if(this.tipTickets.length > 0) {
        this.deleteAllExistingTickets();
        return;
      } else {

        if(this.upliftTickets.length > 0) {
          this.bulkSaveMaterialUpliftTickets();
        }

        else {
          this.redirect();
        }
        return;
      }
    }

    this.invoiceService.assignJobsToInvoice([this.job])
    .pipe(take(1))
    .pipe(catchError((e) => {
     if(e.status === 403 || e.status === 401) {
       return e;
     }
      alert('Cannot assign job to invoice');
      return e;
    }))
    .subscribe((data) => {
      this.redirect();
    })
   }


  bulkSaveOrderLines(orderLines: OrderLine[]) {
    if(!orderLines) {
      this.isServerError = true;
    }

    this.orderService.updateBulkOrderLines(orderLines)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {
      this.assignJobsToInvoice();
    })
  }

  cancel() {
      if(this.isPopup) {
        this.modalService.close('jobSignOffLandEditJobModal');
        this.job = new Job();
        this.jobSignoffLandStateService.$editJobDialogClosed.next(true);
        return;
      }
    localStorage.setItem('WS_MJL_LAND_SIGNOFF_LIST', "");
    window.location.href = '/job-signoff/land';

  }

  getUnitName(unitId: number=-1) {
    return this.units.filter(u => u.id === unitId)[0];
  }

  setQtyTotal() {

    // if loads do counting
   if(this.orderLines[0].unitId === 1) {
   this.orderLines[0].qty = this.job.transportSignOffNotes.split('/').length;
   }

   this.createTickets();
  }

  createTickets() {

    // // Don't create tickets if tip fee is zero
    if(this.job.order.tipFee === 0) {
      return;
    }

    const tickets: string[] = this.job.transportSignOffNotes.split('/');

    if(tickets.length > 0) {
      let mainTicket:string = tickets[0];


      tickets.forEach((ticket: string, index) => {
        let formattedTicketNo: string = ticket;

        if(ticket.length > 3) {
          // It's a large set of numbers so must be a new seq
          mainTicket = ticket;
        }

        // tidy this up and make it context based.
        if(ticket.length === 3) {
          formattedTicketNo = mainTicket.substring(0, mainTicket.length - 3) + ticket;
        }

        if(ticket.length === 2) {
          formattedTicketNo = mainTicket.substring(0, mainTicket.length - 2) + ticket;
        }

        if(!this.tipTickets[index]) {
          this.tipTickets.push({
            collectionTicketNumber: formattedTicketNo,
            jobId: this.job.id,
            qty: 1,
            unitId: this.job.order.tipUnitId, // use tip unit
            price: this.job.order.tipFee,
          } as any)
        } else {
          this.tipTickets[index].collectionTicketNumber = <any>formattedTicketNo;
        }
      })

      // clear up any enpty tickets
      this.tipTickets = this.tipTickets.filter(tt => tt.collectionTicketNumber.toString().trim() !== '' && tt.collectionTicketNumber !== <any>mainTicket.substring(0, mainTicket.length - 3));
      this.tipTickets = this.tipTickets.filter(tt => tt.collectionTicketNumber.toString().trim() !== '' && tt.collectionTicketNumber !== <any>mainTicket.substring(0, mainTicket.length - 2));

    }


  }

  updateNotesForTimeHire() {
    let notes = '';

    if(this.startTime && this.startTime !== '') {
      notes += moment('2021-01-01 ' + this.startTime).format('hh:mm');
    }

    if(this.endTime && this.endTime !== '') {
      notes += '-' + moment('2021-01-01 ' + this.endTime).format('hh:mmA');
    }

    if(this.travelTime && this.travelTime != 0) {
      if(this.travelTime === 30) {
       notes += ' 1/2HR T/T';
      } else if(this.travelTime === 60) {
        notes += ' 1HR T/T';
     } else if(this.travelTime === 15) {
      notes += ' 1/4HR T/T';
    } else {

      var hours = Math.floor(this.travelTime / 60);
      var minutes = this.travelTime % 60;

       notes += " ";

       if(hours > 0) {
        notes += hours + 'HR ';
       }

       if(minutes > 0) {
         notes += minutes + 'MINS';
       }

       notes += " T/T";
     }
  }

  if(false) {
    let parts = this.job.transportSignOffNotes.split(/-(.+)/); //split on first instance
    parts[1] = notes;
    this.job.transportSignOffNotes = parts.join('-');
    this.job.transportSignOffNotes = this.job.transportSignOffNotes.substring(0, this.job.transportSignOffNotes.length - 1);
  } else {
    this.job.transportSignOffNotes = notes;
  }
}

  deleteAllExistingTickets() {
    this.tipTicketService.deleteTicketsByJobId(this.job.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not delete existing tickets');
      return e;
    }))
    .subscribe(() => {
      this.bulkUpdateTickets();
    })
  }

  bulkSaveMaterialUpliftTickets() {
    this.materialUpliftTicketService.bulkUpdateTickets(this.upliftTickets)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not save tickets');
      return e;
    }))
    .subscribe((tickets: any) => {
      this.redirect();
    });
  }

  bulkUpdateTickets() {
    this.tipTicketService.bulkCreateTickets(this.tipTickets)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not save existing tickets');
      return e;
    }))
    .subscribe(() => {
      if(this.upliftTickets.length === 0) {
        this.redirect();
      } else {
        this.bulkSaveMaterialUpliftTickets();
      }
    })
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

  generateUpliftTicketsFromUplifts() {

    // don't do this if no uplifts
    if(this.uplifts.length === 0) {
      return;
    }

    const tickets: string[] = this.job.transportSignOffNotes.split('/');

    if(tickets.length > 0) {
      let mainTicket:string = tickets[0];


      tickets.forEach((ticket: string, index) => {
        let formattedTicketNo: string = ticket;

        if(ticket.length > 3) {
          // It's a large set of numbers so must be a new seq
          mainTicket = ticket;
        }

        // tidy this up and make it context based.
        if(ticket.length === 3) {
          formattedTicketNo = mainTicket.substring(0, mainTicket.length - 3) + ticket;
        }

        if(ticket.length === 2) {
          formattedTicketNo = mainTicket.substring(0, mainTicket.length - 2) + ticket;
        }

        if(!this.upliftTickets[index]) {
          let uplift = this.uplifts[0];
          const ticket = new MaterialUpliftTicket();
          ticket.deleted = false;
          ticket.signedOff = false;
          ticket.jobId = this.job.id;
          ticket.job = {id: this.job.id} as any;
          ticket.unitId = uplift.unitId;
          ticket.unit = {id: uplift.unitId} as any;
          ticket.price = uplift.price;
          ticket.name = uplift.name;
          ticket.accountId = uplift.accountId;
          ticket.account = {id: uplift.accountId} as any;
          ticket.ticketNumber = formattedTicketNo;


          let weights = this.weights.split('/');

          let weight = weights[index];

          if(weight) {
            ticket.qty = +weight;
          } else {
            ticket.qty = 0;
          }

          this.upliftTickets.push(ticket);

        } else {
          this.upliftTickets[index].ticketNumber = <any>formattedTicketNo;


          let weights = this.weights.split('/');

          let weight = weights[index];

          if(weight) {
            this.upliftTickets[index].qty = +weight;
          } else {
            this.upliftTickets[index].qty = 0;
          }
        }
      })

      // clear up any enpty tickets
      this.upliftTickets = this.upliftTickets.filter(tt => tt.ticketNumber.toString().trim() !== '' && tt.ticketNumber !== <any>mainTicket.substring(0, mainTicket.length - 3));
      this.upliftTickets = this.upliftTickets.filter(tt => tt.ticketNumber.toString().trim() !== '' && tt.ticketNumber !== <any>mainTicket.substring(0, mainTicket.length - 2));

    }

  }

}
