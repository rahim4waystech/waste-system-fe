import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from 'src/app/order/services/order.service';
import { Order } from 'src/app/order/models/order.model';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { SkipTimelineStateService } from '../../services/skip-timeline-state.service';
import * as moment from 'moment';
import { JobService } from '../../services/job.service';
import { PaginationService } from 'src/app/core/services/pagination.service';

@Component({
  selector: 'app-timeline-skip-accepted-jobs',
  templateUrl: './timeline-skip-accepted-jobs.component.html',
  styleUrls: ['./timeline-skip-accepted-jobs.component.scss']
})
export class TimelineSkipAcceptedJobsComponent implements OnInit {

  orders: Order[] = [];

  search: string = '';
  page: number = 1;
  sortBy: string = 'time';

  @Input()
  date: string;

  vehicleTypeId: number = -1;

  currentOrder: Order = new Order();

  draggingId: number = -1;

  dragData: any = {};

  paginationService: PaginationService = new PaginationService();
  constructor(private orderService: OrderService,
    private jobService: JobService,
    
    private skipTimelineStateService: SkipTimelineStateService,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.loadOrders();

    this.skipTimelineStateService.$skipDateChanged.subscribe((date: Date) => {
      this.date = moment(date).format('YYYY-MM-DD');

      this.page = 1;
      this.loadOrders();
    });

    this.skipTimelineStateService.$skipReloadAcceptedJobs.subscribe(() => {
      this.page = 1;
      this.loadOrders();
    });


    this.skipTimelineStateService.$skipVehicleTypeChanged.subscribe((typeId: number) => {
      this.vehicleTypeId = typeId;
    });

    this.skipTimelineStateService.$skipDragDataChanged.subscribe((data) => {
      this.dragData = data;
    })
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

  loadOrders() {
    this.orderService.getSkipOrdersForTimelineByUnallocated(this.date, this.page, this.sortBy, this.vehicleTypeId, this.search)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Accepted orders could not be loaded");
      return e;
    }))
    .subscribe((data: any) => {
      this.orders = data;

      // this.paginationService.setAmountPerPage(5);
      // this.paginationService.setTotalRecords(data.total);
      // this.paginationService.setPaginatedTotal(data.count);
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

  dragStart(event, order: Order) {
    this.draggingId = order.id;
    this.skipTimelineStateService.$skipDragDataChanged.next({type: 'orderDrop', data: order});
  }

  dragEnd(event) {
     this.draggingId = -1;
  }

  isEarlierThanToday(date) {
    return moment(date).startOf('day').isBefore(moment(this.date).startOf('day'));
  }

  onJobDrop($event) {

    if(this.dragData.data.jobStatusId === 4 || this.dragData.data.jobStatusId === 5) {
      alert('Cannot remove invoiced or signed off job');
      return;
    }

    const order: Order = JSON.parse(JSON.stringify(this.dragData.data.order));

    order.orderAllocated = false;
    const originalStatusId = this.dragData.data.jobStatusId;
    // Make job deleted
    this.dragData.data.jobStatusId = 3;
  //  this.dragData.data.jobStatus.id = 3;

    this.jobService.updateJob( this.dragData.data)
    .pipe(take(1))
    .pipe(catchError((e) => {
      // revert if problem
      this.dragData.data.jobStatusId = originalStatusId;
    //  this.dragData.data.jobStatus.id = originalStatusId;
      return e;
    }))
    .subscribe(() => {
      this.updateOrder(order).subscribe(() => {
        this.skipTimelineStateService.$skipReloadAcceptedJobs.next(true);
        this.dragData.data = {};
      })

    })
  }

  updateOrder(order: Order) {
    return this.orderService.updateOrder(order)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update order. Please try again later')
      return e;
    }))
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

}
