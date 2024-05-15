import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderType } from '../models/order-type.model';
import { Order } from '../models/order.model';
import { Quote } from '@angular/compiler';
import { QuoteLine } from '../models/quote-line-model';
import { OrderLine } from '../models/order-line.model';
import { SkipOrderType } from '../models/skip-order-type.model';
import { OrderStatusHistory } from '../models/order-status-history.model';
import { RequestQueryBuilder, QuerySortOperator } from '@nestjsx/crud-request';
import * as moment from 'moment';
import { Unit } from '../models/unit.model';
import { ContainerSizeType } from 'src/app/container/models/container-size-type.model';
import { ContainerType } from 'src/app/container/models/container-type.model';
import { Grade } from 'src/app/container/models/grade.model';
import { ShredderOrderType } from '../models/shredder-order-type.model';
import { ShreddingMethod } from '../models/shredding-method.model';
import { Account } from '../models/account.model';
import { MaterialUplift } from '../models/material-uplift.model';
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { OrderStatus } from '../models/order-status.model';
import { OrderProvision } from '../models/order-provision.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }

  /**
   * creates a order in the backend based on order object.
   * @param Order order object.
   *
   * @returns Observable<Order>
   */
  createOrder(order: Order): Observable<Order> {

    if (!order) {
      throw new Error('order service: you must supply a order object for saving');
    }

    delete order.createdAt;
    delete order.updatedAt;


    if(order.skipOrderTypeId === -1) {
      order.skipOrderType = {id: -1} as SkipOrderType;
    }

    if(order.containerSizeTypeId === -1) {
      order.containerSizeType = {id: -1} as ContainerSizeType;
    }

    if(order.containerTypeId === -1) {
      order.containerType = {id: -1} as ContainerType;
    }

    if(order.gradeId === -1) {
      order.grade = {id: -1} as Grade;
    }


    if (order.id > 0) {
      throw new Error('order service: Cannot create a existing object');
    }

    if (order.accountId === -1){
      throw new Error('Invalid Account: Account id Must not be -1');
    }

    delete order.id;
    delete order.account.depot;
    order.site = {id: order.siteId} as any;
    return this.httpClient.post(this._endpoint + 'order',
      JSON.stringify(order),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <Order>data;
      }));
  }

  createBulkUplifts(uplifts: MaterialUplift[]): Observable<MaterialUplift[]> {

    if (!uplifts) {
      throw new Error('You must provide uplifts for createBulkUplifts');
    }

    uplifts.forEach((line) => {
      if (line.id > 0) {
        throw new Error('uplift cannot be existing record on createBulkUplifts');
      }

      if (line.orderId === -1 || line.orderId === undefined || line.orderId === null) {
        throw new Error('uplift orderId must be set on createBulkUplifts');
      }

      delete line.id;
      delete line.createdAt;
      delete line.updatedAt;
    })

    return this.httpClient.post(this._endpoint + 'material-uplift/bulk', { "bulk": uplifts }).pipe(map((value: any) => {
      return <MaterialUplift[]>value;
    }));
  }


  createBulkOrderLines(orderLines: OrderLine[]): Observable<OrderLine[]> {

    if (!orderLines) {
      throw new Error('You must provide orderlines for createBulkOrderLines');
    }

    orderLines.forEach((line) => {
      if (line.id > 0) {
        throw new Error('OrderLine cannot be existing record on createBulkOrderLines');
      }

      if (line.orderId === -1 || line.orderId === undefined || line.orderId === null) {
        throw new Error('Orderline orderId must be set on createBulkOrderLines');
      }

      delete line.id;
      delete line.createdAt;
      delete line.updatedAt;
    })

    return this.httpClient.post(this._endpoint + 'order-line/bulk', { "bulk": orderLines }).pipe(map((value: any) => {
      return <OrderLine[]>value;
    }));
  }

  /**
   * updates a order in the backend based on order object.
   * @param order order object.
   *
   * @returns Observable<Order>
   */
  updateOrder(order: Order): Observable<Order> {


    if (!order) {
      throw new Error('order service: you must supply a order object for saving');
    }

    delete order.createdAt;
    delete order.updatedAt;


    if(order.skipOrderTypeId === -1) {
      order.skipOrderType = {id: -1} as SkipOrderType;
    }

    if(order.containerSizeTypeId === -1) {
      order.containerSizeType = {id: -1} as ContainerSizeType;
    }

    if(order.containerTypeId === -1) {
      order.containerType = {id: -1} as ContainerType;
    }

    if(order.gradeId === -1) {
      order.grade = {id: -1} as Grade;
    }

    if(order.shredderOrderType === null) {
      order.shredderOrderType = {id: -1} as any;
    }


    if (!order.id || order.id === -1) {
      throw new Error('order service: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'order/' + order.id,
      JSON.stringify(order),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <Order>data;
      }));
  }

  acceptOrder(id: number): Observable<Order> {

    if (id <= 0 || id === null || id === undefined) {
      throw new Error('OrderService: Id must be a valid number');
    }

    return this.httpClient.post(this._endpoint + 'order/accept/' + id, {}).pipe(map((value: any) => {
      return <Order>value;
    }));
  }

  declineOrder(id: number, reason: string=''): Observable<Order> {

    if (id <= 0 || id === null || id === undefined) {
      throw new Error('OrderService: Id must be a valid number');
    }

    return this.httpClient.post(this._endpoint + 'order/decline/' + id, {reason: reason}).pipe(map((value: any) => {
      return <Order>value;
    }));
  }

  getAllOrderTypes(): Observable<OrderType[]> {
    return this.httpClient.get(this._endpoint + 'order-type')
      .pipe(map((value: any) => {
        return <OrderType[]>value;
      }))
  }


  /**
   * Get a account from the backend by id
   *
   * @param id number id of account to get
   *
   * @returns Observable<Account>
   */
  getAccountById(id: number): Observable<Account> {

    if (id <= 0 || id === null || id === undefined) {
      throw new Error('AccountService: Id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'account/' + id).pipe(map((value: any) => {
      return <Account>value;
    }));
  }

  getActiveOrdersByAccountAndSite(accountId: number=-1, siteId: number=-1) {
    if (accountId <= 0 || accountId === null || accountId === undefined) {
      throw new Error('OrderService getActiveOrdersByAccountAndSite account id must be a valid number');
    }

    if (siteId <= 0 || siteId === null || siteId === undefined) {
      throw new Error('OrderService getActiveOrdersByAccountAndSite site id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'order?filter=accountId||eq||' + accountId + '&filter=siteId||eq||' + siteId + '&filter=orderStatusId||eq||2&join=tipSite').pipe(map((data) => {
      return <Order[]>data;
    }));


  }

  getOrdersByIds(orderIds: number[]) {
    if(!orderIds || orderIds.length === 0) {
      throw new Error('Order ids must be defined');
    }

    return this.httpClient.get(this._endpoint + 'order?filter=id||in||' + orderIds.join(',') + '&join=tipSite&join=orderLines');

  }


  getQuotesBySiteId(siteId: number): Observable<Quote[]> {
    return this.httpClient.get(this._endpoint + 'quote?filter=accountId||eq||' + siteId).pipe(map((data) => {
      return <Quote[]>data;
    }));
  }

  getAllShredderOrderTypes(): Observable<ShredderOrderType[]> {
    return this.httpClient.get(this._endpoint + 'shredder-order-type').pipe(map((data) => {
      return <ShredderOrderType[]>data;
    }));
  }

  getAllShreddingMethods(): Observable<ShreddingMethod[]> {
    return this.httpClient.get(this._endpoint + 'shredding-method').pipe(map((data) => {
      return <ShreddingMethod[]>data;
    }));
  }

  getAllSkipOrderTypes(): Observable<SkipOrderType[]> {
    return this.httpClient.get(this._endpoint + 'skip-order-type').pipe(map((data) => {
      return <SkipOrderType[]>data;
    }));
  }

  getAllStatuses(): Observable<OrderStatus[]> {
    return this.httpClient.get(this._endpoint + 'order-status').pipe(map((data) => {
      return <OrderStatus[]>data;
    }));
  }

  getQuoteLinesByQuoteId(quoteId: number): Observable<QuoteLine[]> {
    return this.httpClient.get(this._endpoint + 'quote-line?filter=quoteId||eq||' + quoteId).pipe(map((data) => {
      return <QuoteLine[]>data;
    }));
  }

  getSameCustomerAndSite() {
    return this.httpClient.get(this._endpoint + 'order/same-customer-and-site');
  }

  getHistoryByOrderId(orderId: number): Observable<OrderStatusHistory[]> {
    return this.httpClient.get(this._endpoint + 'order-status-history?filter=orderId||eq||' + orderId).pipe(map((data) => {
      return <OrderStatusHistory[]>data;
    }));
  }

  updateBulkOrderLines(orderLines: OrderLine[]): Observable<OrderLine[]> {

    if (!orderLines) {
      throw new Error('You must provide orderlines for createBulkOrderLines');
    }

    orderLines.forEach((line) => {

      if(line.id === -1 || !line.id) {
        delete line.id;
      }

      delete line.createdAt;
      delete line.updatedAt;
    })

    return this.httpClient.post(this._endpoint + 'order-line/bulk', { "bulk": orderLines }).pipe(map((value: any) => {
      return <OrderLine[]>value;
    }));
  }



  /**
 * Get a order from the backend by id
 *
 * @param id number id of order to get
 *
 * @returns Observable<Order>
 */
  getOrderById(id: number): Observable<Order> {

    if (id <= 0 || id === null || id === undefined) {
      throw new Error('OrderService: Id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'order/' + id).pipe(map((value: any) => {
      return <Order>value;
    }));
  }

  getOrderByIdForPOD(id: number): Observable<Order> {

    if (id <= 0 || id === null || id === undefined) {
      throw new Error('OrderService: Id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'order/' + id + '?join=tipSite').pipe(map((value: any) => {
      return <Order>value;
    }));
  }
  /**
 * Get a order from the backend by id
 *
 * @param id number id of order to get
 *
 * @returns Observable<Order>
 */
  getSkipOrdersByDate(start:string,end:string): Observable<Order> {
    return this.httpClient.get(this._endpoint + 'order/?filter=date||gte||' + start + '&filter=date||lte||' + end).pipe(map((value: any) => {
      return <Order>value;
    }));
  }

  getOrderLinesByOrderId(orderId: number): Observable<OrderLine[]> {
    return this.httpClient.get(this._endpoint + 'order-line?filter=orderId||eq||' + orderId).pipe(map((data) => {
      return <OrderLine[]>data;
    }));
  }

  getUpliftsByOrderId(orderId: number): Observable<MaterialUplift[]> {
    return this.httpClient.get(this._endpoint + 'material-uplift?filter=orderId||eq||' + orderId).pipe(map((data) => {
      return <MaterialUplift[]>data;
    }));
  }

  getOrderLinesByOrderIdForPod(orderId: number): Observable<OrderLine[]> {
    return this.httpClient.get(this._endpoint + 'order-line?filter=orderId||eq||' + orderId + '&join=quoteLine&join=quoteLine.unit').pipe(map((data) => {
      return <OrderLine[]>data;
    }));
  }

  deleteOrderLinesForOrderId(orderId: number) {
    if (!orderId) {
      throw new Error('You must provide orderId for deleteOrderLinesForOrderId');
    }

    return this.httpClient.request('delete', this._endpoint + 'order-line/deleteAllByOrderId/' + orderId);

  }

  deleteOrderLine(id: number) {
    if (!id) {
      throw new Error('You must provide id for deleteOrderLine');
    }

    return this.httpClient.request('delete', this._endpoint + 'order-line/deleteOrderLine/' + id);

  }

  deleteUpliftsForOrderId(orderId: number) {
    if (!orderId) {
      throw new Error('You must provide orderId for deleteUpliftsForOrderId');
    }

    return this.httpClient.request('delete', this._endpoint + 'material-uplift/deleteAllByOrderId/' + orderId);

  }

  // Used by the timeline to get accepted orders
  getOrdersForShredderTimelineByDate(date: string='', page: number = 1, sort: string='time', search: string=''): Observable<any> {
    if(!page || page < 1) {
      throw new Error('You must provide a valid page for getOrdersForTransportTimelineByDate');
    }

    if(['time', 'account', "po-number"].indexOf(sort) === -1) {
      throw new Error('You must provide a valid sort type for getOrdersForTransportTimelineByDate');
    }

    if(!date || date === '') {
      throw new Error('You must provide a valid date for getOrdersForTransportTimelineByDate')
    }

    date = moment(date).format('YYYY-MM-DD');



    return this.httpClient.get(this._endpoint + `order/shredding/${date}?page=${page}&sort=${sort}&search=${search}`).pipe(map((data:any) => {
      return data;
    }));

  }


  getContractOrdersForArticTimelineByDate(date: string='', page: number = 1, sort: string='time', orderTypeId: number = -1, search: string='', filters: any = {}): Observable<any> {
    if(!page || page < 1) {
      throw new Error('You must provide a valid page for getOrdersForTransportTimelineByDate');
    }

    if(['time', 'account', "po-number"].indexOf(sort) === -1) {
      throw new Error('You must provide a valid sort type for getOrdersForTransportTimelineByDate');
    }

    if(!date || date === '') {
      throw new Error('You must provide a valid date for getOrdersForTransportTimelineByDate')
    }

    date = moment(date).format('YYYY-MM-DD');

    const qb: RequestQueryBuilder = RequestQueryBuilder.create();
    qb.setPage(page);
    qb.setLimit(5); // amount per page
  //  qb.setFilter({field: 'date', operator: 'eq', value: '"' + date + '"'}) // only the date
   qb.setFilter({field: 'orderStatusId', operator: 'eq', value: 2}) //Accepted
   qb.setFilter({field: 'isContract', operator:'eq', value: 1}); // is not a contract artic job

    if(filters['customer'] && filters['customer'] !== -1) {
      qb.setFilter({field: 'accountId', operator: 'eq', value: filters['customer']});
    }

    if(filters['site'] && filters['site'] !== -1) {
      qb.setFilter({field: 'siteId', operator: 'eq', value: filters['site']});
    }

    if(filters['tipSite'] && filters['tipSite'] !== -1) {
      qb.setFilter({field: 'tipSiteId', operator: 'eq', value: filters['tipSite']});
    }

    if(sort === 'time') {
      qb.sortBy({field: 'time', order: "DESC"});
    }

    if(sort === "account") {
      qb.sortBy({field: 'account.name', order: "DESC"});
    }

    if(sort === "po-number") {
      qb.sortBy({field: "poNumber", order: "DESC"});
    }

    qb.setJoin(['orderLines']);
    qb.setJoin(['orderLines.quoteLine']);
    qb.setJoin(['updatedUser']);
    qb.setJoin(['tipSite']);



    // Which order type is the order for? Tipper? Grab? etc.
    if(orderTypeId !== -1) {
      // qb.setFilter({field: 'orderTypeId', operator: 'eq', value: orderTypeId});
    }
    return this.httpClient.get(this._endpoint + 'order?' +  qb.query()).pipe(map((data:any) => {
      return data;
    }));

  }

  getOrdersForArticTimelineByDate(date: string='', page: number = 1, sort: string='time', orderTypeId: number = -1, search: string='', filters: any = {}): Observable<any> {
    if(!page || page < 1) {
      throw new Error('You must provide a valid page for getOrdersForTransportTimelineByDate');
    }

    if(['time', 'account', "po-number"].indexOf(sort) === -1) {
      throw new Error('You must provide a valid sort type for getOrdersForTransportTimelineByDate');
    }

    if(!date || date === '') {
      throw new Error('You must provide a valid date for getOrdersForTransportTimelineByDate')
    }

    date = moment(date).format('YYYY-MM-DD');

    const qb: RequestQueryBuilder = RequestQueryBuilder.create();
    qb.setPage(page);
    qb.setLimit(5); // amount per page
   //qb.setFilter({field: 'date', operator: 'eq', value: '"' + date + '"'}) // only the date
   qb.setFilter({field: 'orderStatusId', operator: 'eq', value: 2}) //Accepted
   qb.setFilter({field: 'isContract', operator:'ne', value: 1}); // is not a contract artic job

    if(filters['customer'] && filters['customer'] !== -1) {
      qb.setFilter({field: 'accountId', operator: 'eq', value: filters['customer']});
    }

    if(filters['site'] && filters['site'] !== -1) {
      qb.setFilter({field: 'siteId', operator: 'eq', value: filters['site']});
    }

    if(filters['tipSite'] && filters['tipSite'] !== -1) {
      qb.setFilter({field: 'tipSiteId', operator: 'eq', value: filters['tipSite']});
    }

    if(sort === 'time') {
      qb.sortBy({field: 'time', order: "DESC"});
    }

    if(sort === "account") {
      qb.sortBy({field: 'account.name', order: "DESC"});
    }

    if(sort === "po-number") {
      qb.sortBy({field: "poNumber", order: "DESC"});
    }

    qb.setJoin(['orderLines']);
    qb.setJoin(['orderLines.quoteLine']);
    qb.setJoin(['updatedUser']);
    qb.setJoin(['tipSite']);



    // Which order type is the order for? Tipper? Grab? etc.
    if(orderTypeId !== -1) {
      qb.setFilter({field: 'orderTypeId', operator: 'eq', value: orderTypeId});
    }
    return this.httpClient.get(this._endpoint + 'order?' +  qb.query()).pipe(map((data:any) => {
      return data;
    }));

  }

  // Used by the timeline to get accepted orders
  getOrdersForTransportTimelineByDate(date: string='', page: number = 1, sort: string='time', orderTypeId: number = -1, search: string='', filters: any = {}): Observable<any> {
    if(!page || page < 1) {
      throw new Error('You must provide a valid page for getOrdersForTransportTimelineByDate');
    }

    if(['time', 'account', "po-number"].indexOf(sort) === -1) {
      throw new Error('You must provide a valid sort type for getOrdersForTransportTimelineByDate');
    }

    if(!date || date === '') {
      throw new Error('You must provide a valid date for getOrdersForTransportTimelineByDate')
    }

    date = moment(date).format('YYYY-MM-DD');

    const qb: RequestQueryBuilder = RequestQueryBuilder.create();
    qb.setPage(page);
    qb.setLimit(5); // amount per page
  //  qb.setFilter({field: 'date', operator: 'eq', value: '"' + date + '"'}) // only the date
   qb.setFilter({field: 'orderStatusId', operator: 'eq', value: 2}) //Accepted

    if(filters['customer'] && filters['customer'] !== -1) {
      qb.setFilter({field: 'accountId', operator: 'eq', value: filters['customer']});
    }

    if(filters['site'] && filters['site'] !== -1) {
      qb.setFilter({field: 'siteId', operator: 'eq', value: filters['site']});
    }

    if(filters['tipSite'] && filters['tipSite'] !== -1) {
      qb.setFilter({field: 'tipSiteId', operator: 'eq', value: filters['tipSite']});
    }

    if(filters['orderId'] && filters['orderId'] !== -1) {
      qb.setFilter({field: 'id', operator: 'eq', value: filters['orderId']});
    }

    if(sort === 'time') {
      qb.sortBy({field: 'time', order: "DESC"});
    }

    if(sort === "account") {
      qb.sortBy({field: 'account.name', order: "DESC"});
    }

    if(sort === "po-number") {
      qb.sortBy({field: "poNumber", order: "DESC"});
    }

    qb.setJoin(['orderLines']);
    qb.setJoin(['orderLines.quoteLine']);
    qb.setJoin(['updatedUser']);
    qb.setJoin(['tipSite']);



    // Which order type is the order for? Tipper? Grab? etc.
    if(orderTypeId !== -1) {
      qb.setFilter({field: 'orderTypeId', operator: 'eq', value: orderTypeId});
    }
 
    return this.httpClient.get(this._endpoint + 'order?' +  qb.query()).pipe(map((data:any) => {
      return data;
    }));

  }

   // Used by the timeline to get accepted orders
   // Added by Rahim
  


  // Used by the timeline to get accepted orders
  getSkipOrdersForTimelineByDate(date: string='', page: number = 1, sort: string='time', vehicleTypeId: number = -1, search: string=''): Observable<Order[]> {
    if(!page || page < 1) {
      throw new Error('You must provide a valid page for getSkipOrdersForTimelineByDate');
    }

    if(['time', 'account', 'skip-type',"container-type", "po-number"].indexOf(sort) === -1) {
      throw new Error('You must provide a valid sort type for getSkipOrdersForTimelineByDate');
    }

    if(!date || date === '') {
      throw new Error('You must provide a valid date for getSkipOrdersForTimelineByDate')
    }

    date = moment(date).format('YYYY-MM-DD');

    const qb: RequestQueryBuilder = RequestQueryBuilder.create();
    qb.setPage(page);
    qb.setLimit(10); // amount p4200er page
   qb.setFilter({field: 'date', operator: 'eq', value: '"' + date + '"'}) // only the date
    qb.setFilter({field: 'orderTypeId', operator: 'eq', value: 1}) // skips only
    qb.setFilter({field: 'orderStatusId', operator: 'eq', value: 2}) //Accepted

    if(search !== '') {
      qb.setFilter({field: 'account.name', operator: 'cont', value: search});
    }

    if(sort === 'time') {
      qb.sortBy({field: 'time', order: "DESC"});
    }

    if(sort === "account") {
      qb.sortBy({field: 'account.name', order: "DESC"});
    }

    if(sort === "skip-type") {
      qb.sortBy({field: 'skipOrderType.name', order: "DESC"})
    }

    if(sort === "container-type") {
      qb.sortBy({field: "containerSizeType.size", order: "DESC"})
    }

    if(sort === "po-number") {
      qb.sortBy({field: "poNumber", order: "DESC"});
    }

    if(vehicleTypeId !== -1) {
      qb.setFilter({field: 'containerSizeType.vehicleTypeId', operator: 'eq', value: vehicleTypeId});
    }
    return this.httpClient.get(this._endpoint + 'order?' +  qb.query()).pipe(map((data:any) => {
      return <Order[]>data.data;
    }));

  }

  // Used by the timeline to get accepted orders
  getSkipOrdersForTimelineByUnallocated(date: string, page: number = 1, sort: string='time', vehicleTypeId: number = -1, search: string=''): Observable<any> {
    if(!page || page < 1) {
      throw new Error('You must provide a valid page for getSkipOrdersForTimelineByDate');
    }

    if(['time', 'account', 'skip-type',"container-type", "po-number"].indexOf(sort) === -1) {
      throw new Error('You must provide a valid sort type for getSkipOrdersForTimelineByDate');
    }


    const qb: RequestQueryBuilder = RequestQueryBuilder.create();
    // qb.setPage(page);
    // qb.setLimit(5); // amount per page
   qb.setFilter({field: 'orderAllocated', operator: 'ne', value: true}) // only the date
    qb.setFilter({field: 'orderTypeId', operator: 'eq', value: 1}) // skips only

    if(search !== '') {
      qb.setFilter({field: 'account.name', operator: 'cont', value: search});
    }

    if(sort === 'time') {
      qb.sortBy({field: 'time', order: "DESC"});
    }

    if(sort === "account") {
      qb.sortBy({field: 'account.name', order: "DESC"});
    }

    if(sort === "skip-type") {
      qb.sortBy({field: 'skipOrderType.name', order: "DESC"})
    }

    if(sort === "container-type") {
      qb.sortBy({field: "containerSizeType.size", order: "DESC"})
    }

    if(sort === "po-number") {
      qb.sortBy({field: "poNumber", order: "DESC"});
    }

    if(vehicleTypeId !== -1) {
      qb.setFilter({field: 'containerSizeType.vehicleTypeId', operator: 'eq', value: vehicleTypeId});
    }

    qb.setFilter({field: 'date', operator: 'lte', value: '"' + date + '"'})
   qb.setFilter({field: 'orderStatusId', operator: 'eq', value: 2}) //Accepted

    return this.httpClient.get(this._endpoint + 'order?' +  qb.query()).pipe(map((data:any) => {
      return data;
    }));

  }

  // Used by the timeline to get accepted orders
  getPaginatedArticOrdersForTimelineByDate(date: string='', page: number = 1,limit:number, sort: string='time', vehicleTypeId: number = -1, search: string=''): Observable<Order[]> {
    if(!page || page < 1) {
      throw new Error('You must provide a valid page for getArticOrdersForTimelineByDate');
    }

    if(['time', 'account', 'skip-type',"container-type", "po-number"].indexOf(sort) === -1) {
      throw new Error('You must provide a valid sort type for getArticOrdersForTimelineByDate');
    }

    // if(!date || date === '') {
    //   throw new Error('You must provide a valid date for getArticOrdersForTimelineByDate')
    // }

    date = moment(date).format('YYYY-MM-DD');

    const qb: RequestQueryBuilder = RequestQueryBuilder.create();
    qb.setPage(page);
    qb.setLimit(limit); // amount per page
   //qb.setFilter({field: 'date', operator: 'eq', value: '"' + date + '"'}) // only the date
    qb.setFilter({field: 'orderTypeId', operator: 'eq', value: 4}) // artics only
    qb.setFilter({field: 'orderStatusId', operator: 'eq', value: 2}) //Accepted

    if(search !== '') {
      qb.setFilter({field: 'account.name', operator: 'cont', value: search});
    }

    if(sort === 'time') {
      qb.sortBy({field: 'time', order: "DESC"});
    }

    if(sort === "account") {
      qb.sortBy({field: 'account.name', order: "DESC"});
    }

    if(sort === "po-number") {
      qb.sortBy({field: "poNumber", order: "DESC"});
    }

    return this.httpClient.get(this._endpoint + 'order?' +  qb.query()).pipe(map((data:any) => {
      return <Order[]>data;
    }));

  }

  getAllUnits(): Observable<Unit[]> {
    return this.httpClient.get(this._endpoint + 'unit?sort=name,ASC').pipe(map((data: any) => {
      return <Unit[]>data;
    }));
  }

  bulkUpdateOrders(orders: Order[]): Observable<Order[]> {
    if(!orders) {
      throw new Error('You must supply orders for bulk update');
    }

    orders.forEach((order: Order) => {
      delete order.createdAt;
      delete order.updatedAt;
    });


    return this.httpClient.post(this._endpoint + 'order/bulk', { "bulk": orders }).pipe(map((value: any) => {
      return <Order[]>value;
    }));
  }

  copyOrderToDates(orderId: Number, dates: string) {
    return this.httpClient.post(this._endpoint + 'order/copyToDates', {orderId: orderId, dates: dates}).pipe(map((value: any) => {
      return <OrderLine[]>value;
    }));
  }

  createGrade(grade: Grade): Observable<Grade> {


    if (!grade) {
      throw new Error('order service: you must supply a grade object for saving');
    }

    delete grade.createdAt;
    delete grade.updatedAt;

    if (grade.id > 0) {
      throw new Error('order service: Cannot create a existing object');
    }

    delete grade.id;
    return this.httpClient.post(this._endpoint + 'grade',
      JSON.stringify(grade),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <Grade>data;
      }));
  }

  // getArticAcceptedOrders(): Observable<OrderProvision[]> {
  //   return this.httpClient.get(this._endpoint + 'order/ArticProvissionOrders').pipe(map((value: any) => {
  //     return <OrderProvision[]>value;
  //   }));
  // }


  getArticAcceptedOrders(): Observable<Order[]> {
    return this.httpClient.get(this._endpoint + 'order/ArticProvissionOrders').pipe(map((value: any) => {
      return <Order[]>value;
    }));
  }
  UpdateOrderProvisionAllocation(data: any) {
debugger;
    return this.httpClient.post(this._endpoint + 'order/UpdateOrderProvisionAllocation',
    JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return data;
    }));
    
  }

}
