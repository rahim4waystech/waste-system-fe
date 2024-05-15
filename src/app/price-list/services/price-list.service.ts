import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PriceListItem } from '../models/price-list-item.model';
import { PriceListOtherItem } from '../models/price-list-other-item.model';
import { PriceList } from '../models/price-list.model';
import { ServiceType } from '../models/service-type.model';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {

    /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 getAllServiceTypes(): Observable<ServiceType[]> {
   return this.httpClient.get(this._endpoint + 'service-type')
   .pipe(map((data) => {
     return <ServiceType[]>data;
   }))
 }

 getActiveItemsForPriceList(priceListId: number) {
  if(!priceListId || priceListId === -1) {
    throw new Error('Please supply pricelistid in getActiveItemsForPriceList');
  }

  return this.httpClient.get(this._endpoint + 'price-list-item?filter=priceListId||eq||' + priceListId + '&filter=active||eq||1');
 }

 getActivePriceListsForAccount(accountId: number) {
   if(!accountId || accountId === -1) {
     throw new Error('Please supply a account id in getActivePriceListsForAccount');
   }

   return this.httpClient.get(this._endpoint + 'price-list?filter=active||eq||1&filter=accountId||eq||' + accountId);
 }

 getAllItemsByPriceListId(priceListId: number) {
   if(!priceListId || priceListId === -1) {
     throw new Error('Please supply pricelistid in getAllItemsByPriceListId');
   }

   return this.httpClient.get(this._endpoint + 'price-list-item?filter=priceListId||eq||' + priceListId);
 }

 getAllOtherItemsByPriceListId(priceListId: number) {

  if(!priceListId || priceListId === -1) {
    throw new Error('Please supply pricelistid in getAllOtherItemsByPriceListId');
  }

  return this.httpClient.get(this._endpoint + 'price-list-other-item?filter=priceListId||eq||' + priceListId);
}

getAllOtherItemsByPriceListIds(ids: number[]) {
  if(ids.length === 0) {
    throw new Error('Please supply pricelistid in getAllOtherItemsByPriceListIds');
  }

  return this.httpClient.get(this._endpoint + 'price-list-other-item?sort=createdAt,DESC&filter=priceListId||in||' + ids.join(','));
}

 getAllItemsByPriceListIdExpanded(priceListId: number) {
  if(!priceListId || priceListId === -1) {
    throw new Error('Please supply pricelistid in getAllItemsByPriceListId');
  }

  return this.httpClient.get(this._endpoint + 'price-list-item?filter=priceListId||eq||' + priceListId + '&join=unit');
}


bulkCreateOrUpdatePriceListOtherItems(items: PriceListOtherItem[]) {
  if (!items) {
    throw new Error('You must provide items for bulkCreateOrUpdatePriceListOtherItems');
  }

  items.forEach((line) => {

    if(line.id === -1 || !line.id) {
      delete line.id;
    }

    delete line.createdAt;
    delete line.updatedAt;
  })

  return this.httpClient.post(this._endpoint + 'price-list-other-item/bulk', { "bulk": items }).pipe(map((value: any) => {
    return <PriceListOtherItem[]>value;
  }));
 }

 bulkCreateOrUpdatePriceListItems(items: PriceListItem[]) {
  if (!items) {
    throw new Error('You must provide items for bulkCreateOrUpdatePriceListItems');
  }

  items.forEach((line) => {

    if(line.id === -1 || !line.id) {
      delete line.id;
    }

    delete line.createdAt;
    delete line.updatedAt;
  })

  return this.httpClient.post(this._endpoint + 'price-list-item/bulk', { "bulk": items }).pipe(map((value: any) => {
    return <PriceListItem[]>value;
  }));
 }

 getPriceListById(id: number): Observable<PriceList> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('price list service: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'price-list/' + id).pipe(map((value: any) => {
    return <PriceList>value;
 }));
}

 createPriceList(priceList: PriceList): Observable<PriceList> {


  if(!priceList) {
    throw new Error('price list service: you must supply a price list object for saving');
  }

  delete priceList.createdAt;
  delete priceList.updatedAt;

  if(priceList.id > 0) {
    throw new Error('price list service: Cannot create a existing object');
  }

  delete priceList.id;
  return this.httpClient.post(this._endpoint + 'price-list',
  JSON.stringify(priceList),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <PriceList>data;
  }));
}



updatePriceList(priceList: PriceList): Observable<PriceList> {


  if(!priceList) {
    throw new Error('price list service: you must supply a driver object for saving');
  }

  delete priceList.updatedAt;

  if(!priceList.id || priceList.id === -1) {
    throw new Error('price list service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'price-list/' + priceList.id,
  JSON.stringify(priceList),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <PriceList>data;
  }));
}


}
