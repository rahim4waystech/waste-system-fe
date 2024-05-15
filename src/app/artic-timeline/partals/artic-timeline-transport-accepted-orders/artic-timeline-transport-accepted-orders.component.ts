import { Component, OnInit, HostListener } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { Order } from 'src/app/order/models/order.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { env } from 'process';
import { environment } from 'src/environments/environment';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { OnDestroy } from '@angular/core';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { Unit } from 'src/app/order/models/unit.model';
import { TimelineTransportStateService } from 'src/app/timeline-transport/services/timeline-transport-state.service';
import { OrderProvision } from 'src/app/order/models/order-provision.model';

@Component({
  selector: 'app-artic-timeline-transport-accepted-orders',
  templateUrl: './artic-timeline-transport-accepted-orders.component.html',
  styleUrls: ['./artic-timeline-transport-accepted-orders.component.scss']
})
export class ArticTimelineTransportAcceptedOrdersComponent implements OnInit, OnDestroy {

  searchFilters: any = {
    customer: -1,
    site: -1,
    tipSite: -1,
  };
  accounts: Account[] = [];
  sites: Account[] = [];
  tips: Account[] = [];
  jobs: Job[] = [];
  jobAssignments: JobAssignment[] = [];
  date: string = moment().format('YYYY-MM-DD');
  page: number = 1;
  sortBy: string = 'time';
  //Rahim Artic timeline
  orderTypeId: number = 4; // tipper
  search: string = '';
  draggingId: number = -1;
  paginationService: PaginationService = new PaginationService();

  orders: Order[] = [];

  currentOrder: Order = new Order();

  interval = null;

  units: Unit[] = [];
  mouseX: number = 0;
  mouseY: number = 0;

  constructor(private orderService: OrderService,
    private modalService: ModalService,
    private jobService: JobService,
    private accountService: AccountService,
    private timelineTransportStateService: TimelineTransportStateService) { }



    // mouseMove(event) {
    //   this.mouseX=  event.clientX;
    //   this.mouseY = event.clientY;
    // }

  ngOnInit(): void {
    const lcDate = localStorage.getItem('MJL_TRANSPORT_TIMELINE_DATE');

    if(lcDate && lcDate !== '') {
      this.date = lcDate;
    }

    this.loadOrders();

    this.timelineTransportStateService.$transportDateChanged.subscribe((date) => {
      this.date = moment(date).format('YYYY-MM-DD');
      this.loadOrders();
    })

    this.timelineTransportStateService.$transportOrderTypeChanged.subscribe((orderTypeId) => {
      this.orderTypeId = orderTypeId;
      this.page = 1;
      this.loadOrders();
    })

    this.timelineTransportStateService.$transportNewJobDialogClosed.subscribe((job: Job) => {
      this.loadOrders();
    });

    this.timelineTransportStateService.$transportSelectedJobsChanged.subscribe(() => {
      this.loadOrders();
    });

    this.timelineTransportStateService.$transportJobAssignmentDeleted.subscribe(() => {
      this.loadOrders();
    });

    this.timelineTransportStateService.$transportJobAssignmentsUpdated.subscribe((assignments: any) => {
      this.jobAssignments = assignments;
    })

    this.accountService.getAllTips()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load tips')
      return e;
    }))
    .subscribe((tips: Account[]) => {
      this.tips = tips;
      this.tips.unshift({name: 'Select a tip', id: -1} as any);
    });

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load units')
      return e;
    }))
    .subscribe((data: Unit[]) => {
      this.units = data;
    })


    this.accountService.getAllAccountsForCustomerAndProspect()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load accounts')
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.accounts = accounts;
      this.accounts.unshift({name: 'Select a account', id: -1} as any);
    })

    this.accountService.getAllSites()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load sites')
      return e;
    }))
    .subscribe((sites: Account[]) => {
      this.sites = sites;
      this.sites.unshift({name: 'Select a site', id: -1} as any);
    })

    // Every 20 seconds refresh the timeline
    this.interval = setInterval(() => {
      this.loadOrders();
    }, 20000)
  }

  getUnitForJob(order: any) {


    let orderLine = order.orderLines.filter(ol => ol.isPrimaryCharge)[0];

    if(!orderLine) {
      orderLine = order.orderLines[0];
    }

    if(!orderLine) {
      return 'N/A';
    }


    const unit = this.units.filter(u => u.id === orderLine.quoteLine?.product.unitId)[0];

    if(unit) {
      return unit.name;
    } else {
      // must be quick item
      const unitpl = this.units.filter(u => u.id === orderLine.unitId)[0];

      if(!unitpl) {
        return 'N/A';
      }
      return unitpl.name;
    }
  }


  getAcceptedOrdersLabel() {
    return this.orderTypeId === 40 ? 'Daily Jobs' : 'Accepted Orders';
  }

  newSite() {
    this.modalService.open('addNewSiteTimelineModal');
  }

//   @HostListener('document:dragover', ['$event'])
//   dragging(event) {
//     const e = event;

//     const y = e.clientY;

//     if(y - 200 <= 0) {
//       window.scrollBy(0, -40);
//     }

//     if(y > window.innerHeight - 200) {
//       window.scrollBy(0, 40);
//     }

// }

isTippingOnOwnAccount(order: Order): boolean {
  return order.gradeId === 40 || order['orderLines'][0].name.indexOf('UPLIFT ON OUR ACCOUNT') !== -1; // tipping on own account
}

  dragStart(event, order: Order) {



    event.dataTransfer.setDragImage(document.getElementById('div2'),50,50);
    this.draggingId = order.id;

    // hide header to allow scroll
    // document.getElementById("header").style.display = "none";

    this.timelineTransportStateService.$transportDragDataChanged.next({type: 'orderDrop', data: order});
  }

  dragEnd(event) {
     this.draggingId = -1;

     //restore header
    //  document.getElementById("header").style.display = "flex";

  }

  loadOrdersForSearch() {


    // always go back to page 1 to find issue searching
    this.paginationService.setPage(1);
    this.page = 1;
    if(this.orderTypeId === 8) {
      // load shreddin g
      this.loadShreddingOrders();
    } else if(this.orderTypeId === 40) {
      this.loadArticOrders();
    } else {
// load generic
      this.loadGenericOrders();
    }

  }

  loadOrders() {

    if(this.orderTypeId === 8) {
      // load shreddin g
      this.loadShreddingOrders();
    } else if(this.orderTypeId === 40) {
      this.loadArticOrders();
    } else {
// load generic
      this.loadGenericOrders();
    }

  }



  loadArticOrders() {
    this.orderService.getOrdersForTransportTimelineByDate(this.date, this.page, this.sortBy, this.orderTypeId, this.search, this.searchFilters)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403) {
        return e;
      }
      alert("Accepted orders could not be loaded");
      return e;
    }))
    .subscribe((data: any) => {
      this.orders = data.data;
      this.paginationService.setAmountPerPage(5);
      this.paginationService.setTotalRecords(data.total);
      this.paginationService.setPaginatedTotal(data.count);
      this.loadAssignments();
    })
  }

  loadGenericOrders() {
    this.orderService.getOrdersForArticTimelineByDate(this.date, this.page, this.sortBy, this.orderTypeId, this.search, this.searchFilters)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Accepted orders could not be loaded");
      return e;
    }))
    .subscribe((data: any) => {
      this.orders = data.data;
      this.paginationService.setAmountPerPage(5);
      this.paginationService.setTotalRecords(data.total);
      this.paginationService.setPaginatedTotal(data.count);
      this.loadAssignments();
    })
  }
  loadShreddingOrders() {
    this.orderService.getOrdersForShredderTimelineByDate(this.date, this.page, this.sortBy, this.search)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Accepted orders could not be loaded");
      return e;
    }))
    .subscribe((data: any) => {

      this.orders = data.data;
      this.paginationService.setAmountPerPage(5);
      this.paginationService.setTotalRecords(data.count);
      this.paginationService.setPaginatedTotal(this.orders.length);
      this.orders.forEach(order => {
        this.orderService.getOrderLinesByOrderId(order.id)
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401){return e;}
          alert('Order Lines could not be loaded');
          return e;
        }))
        .pipe(take(1))
        .subscribe((quotes:any) => {
          let qtyTotal = 0;
          quotes.forEach(line => {
            qtyTotal += line.qty;
          })
          order.qty = qtyTotal;

          this.jobService.getJobsByOrderId(order.id)
          .pipe(catchError((e) => {
            if(e.status === 403 || e.status === 401){return e;}
            alert('Historical Order Lines could not be loaded');
            return e;
          }))
          .pipe(take(1))
          .subscribe((jobs:any) => {
            let previousTotal = 0;
            jobs.forEach(job => {
              previousTotal += job.qty;
            })
            order.allocated = previousTotal;
          })
        })
      })
      this.loadAssignments();
    })
  }

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

   openModal(name) {
     this.modalService.open(name);
   }

   loadAssignments(){
     this.jobService.getJobsByDateForTransport(this.date, this.orderTypeId)
     .pipe(take(1))
     .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
       alert('could not load job assignments');
       return e;
     }))
     .subscribe((jobs: Job[]) => {
       this.jobs = jobs;
     })
   }

   getPagesArray(): number[] {
    const totalPages: number = this.paginationService.getTotalPages();

    const pagesArray: number[] = [];

    for(let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }

  getCurrentPage(): number {
    return this.paginationService.getPage();
  }

  getTotalRecords(): number {
    return this.paginationService.getTotalRecords();
  }

  getTotalPages(): number {
    return this.paginationService.getTotalPages();
  }

  getOffsetStart(): number {
    return this.paginationService.getOffsetStart();
  }

  getOffsetEnd(): number {
    return this.paginationService.getOffsetEnd();
  }

  isNextActive(): boolean {
    return this.paginationService.isNextActive();
  }

  isPrevActive(): boolean {
    return this.paginationService.isPrevActive();
  }

  onPaginationPageClicked(page: number) {


    this.paginationService.setPage(page);
    this.page = page;
    this.loadOrders();
  }

  onPaginationAmountChanged($event): void {
    // this.paginationService.setAmountPerPage(parseInt($event.target.value, 10));
    // this.amount = this.paginationService.getAmountPerPage();
    // this.paginationService.setPage(1);
    // this.newPage = 1;
    // this.getRecordsForEntity();
  }

   // getAssignedQtyByOrderId(order){
   //   if(order.allocated !== undefined){
   //     let total = order.allocated;
   //     const result =  this.jobs.filter(f=>f.orderId === order.id);
   //
   //     if(result === undefined){
   //       return 0;
   //     } else {
   //       result.forEach(item => {
   //         total += item.qty;
   //       })
   //       return total;
   //     }
   //   } else {
   //     return 0;
   //   }
   // }

   getAllocatedQty(order:Order) {
     let total = 0;

     this.jobAssignments.forEach((jobAssignment: JobAssignment) => {
       const jobsForOrder = jobAssignment.jobs.filter(j => j.orderId === order.id && j.jobStatusId !== 3);

       jobsForOrder.forEach((job) => {
         total += job.qty;
       })
     })

     return total;
   }

   getOrderQty(order: any) {

    if(order.orderLines[0]) {
      return order.orderLines[0].qty;
    } else {
      return 0;
    }
   }

   ngOnDestroy() {
     clearInterval(this.interval);
   }


  clear() {
    this.searchFilters = {
      customer: -1,
      site: -1,
      tipSite: -1,
    };
    this.loadOrders();
  }

  getHoverText(record) {

    let orderLine = record.orderLines[0];

    let productName = '';
    if(orderLine) {
      productName = orderLine.name;
    }

    return 'Parent Job ID: ' + record.id + ' Order REF: ' + record.poNumber + ' Tip Site: ' + record.tipSite.name + ' Product Details: ' + productName;
  }

}
