import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Account } from 'src/app/order/models/account.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AccountType } from 'src/app/order/models/account-type.model';
import { Industry } from 'src/app/order/models/industry.model';
import { AccountRating } from 'src/app/order/models/account-rating.model';
import { TippingPrice } from '../models/tipping-price.model';
import { CustomerDetails } from '../models/customer-details.model';
import { CustomerCategory } from '../models/customer-category.model';
import { TipDetails } from '../models/tip-details.model';
import { DepotDetails } from '../models/depot-details.model';
import { SIC } from '../models/sic.model';
import { Sepa } from '../models/sepa.model';
import { CreditLimit } from '../models/credit-limit.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a account from the backend by id
  *
  * @param id number id of account to get
  *
  * @returns Observable<Account>
  */
 getAccountById(id: number): Observable<Account> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('AccountService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'account/' + id).pipe(map((value: any) => {
     return <Account>value;
  }));
 }

 /**
  * Get all accounts from the backend
  *
  * @returns Observable<Account>
  */
 getAllAccounts(): Observable<Account> {
  return this.httpClient.get(this._endpoint + 'account?sort=name,ASC').pipe(map((value: any) => {
     return <Account>value;
  }));
 }

 /**
  * Get all accounts from the backend
  *
  * @returns Observable<Account>
  */
 getAllAccountsForCustomerAndProspect(): Observable<Account> {
  return this.httpClient.get(this._endpoint + 'account?filter=type_id||eq||3&or=type_id||eq||8').pipe(map((value: any) => {
     return <Account>value;
  }));
 }

  /**
  * creates a account in the backend based on account object.
  * @param Account account object.
  *
  * @returns Observable<Account>
  */
 createAccount(account: Account): Observable<Account> {


  if(!account) {
    throw new Error('account service: you must supply a account object for saving');
  }

  delete account.createdAt;
  delete account.updatedAt;

  if(account.id > 0) {
    throw new Error('account service: Cannot create a existing object');
  }

  delete account.id;
  delete account.depot;

  if(account.sepaId === null) {
   account.sepaId = -1;
 }

 if(account.sepa === null) {
   account.sepa = new Sepa();
 }


  return this.httpClient.post(this._endpoint + 'account',
  JSON.stringify(account),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Account>data;
  }));
}

shredderImport(rows: any[]=[]) {
  return this.httpClient.post(this._endpoint + 'account/shredder-import/',
  JSON.stringify(rows),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return data;
  }));
}


updateAccount(account: Account): Observable<Account> {


  if(!account) {
    throw new Error('account service: you must supply a account object for saving');
  }

  delete account.createdAt;
  delete account.updatedAt;

  if(account.sepa === null || account.sepa === undefined ) {
   account.sepa = new Sepa();
   account.sepaId = -1;
 }

  // for things we don't need but default
  if(account.industry === null || account.industry === undefined) {
    account.industry = new Industry();
    account.industryId = -1;
  }

 if(account.rating === null || account.rating === undefined) {
   account.rating = new AccountRating();
   account.rating_id = -1;
 }
  if(!account.id || account.id === -1) {
    throw new Error('account service: Cannot update an record without id');
  }

  delete account.depot;
  return this.httpClient.put(this._endpoint + 'account/' + account.id,
  JSON.stringify(account),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Account>data;
  }));
}



 createCreditLimit(creditLimit: CreditLimit): Observable<CreditLimit> {


   if(!creditLimit) {
     throw new Error('credit limit service: you must supply a credit limit object for saving');
   }

   delete creditLimit.createdAt;
   delete creditLimit.updatedAt;

   if(creditLimit.id > 0) {
     throw new Error('credit limit service: Cannot create a existing object');
   }

   delete creditLimit.id;

   return this.httpClient.post(this._endpoint + 'credit-limit',
   JSON.stringify(creditLimit),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <CreditLimit>data;
   }));
 }


 updateCreditLimit(creditLimit: CreditLimit): Observable<CreditLimit> {


   if(!creditLimit) {
     throw new Error('credit limit service: you must supply a credit limit object for saving');
   }

   delete creditLimit.createdAt;
   delete creditLimit.updatedAt;

   if(!creditLimit.id || creditLimit.id === -1) {
     throw new Error('credit limit service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'credit-limit/' + creditLimit.id,
   JSON.stringify(creditLimit),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <CreditLimit>data;
   }));
 }

 getAccountTypes(): Observable<AccountType[]> {

 return this.httpClient.get(this._endpoint + 'account-type/').pipe(map((value: any) => {
    return <AccountType[]>value;
 }));
}

 getAccountRatings(): Observable<AccountRating[]> {

 return this.httpClient.get(this._endpoint + 'account-rating/').pipe(map((value: any) => {
    return <AccountRating[]>value;
 }));
}

getAllSitesForAccount(accountId:number): Observable<Account[]> {

  return this.httpClient.get(this._endpoint + 'account?filter=parentId||eq||' + accountId).pipe(map((value: any) => {
     return <Account[]>value;
  }));
 }

  getOneSiteForCustomer(accountId: number){
    return this.httpClient.get(this._endpoint + 'account?filter=type_id||eq||3&parentId||eq||' + accountId).pipe(map((value: any) => {
      return <Account>value;
    }));
  }

 getAllSites(): Observable<Account[]> {

  return this.httpClient.get(this._endpoint + 'account?filter=type_id||eq||13').pipe(map((value: any) => {
     return <Account[]>value;
  }));
 }

getSepaCodes(){
  return this.httpClient.get(this._endpoint + 'sepa');
}

getAllDepots(): Observable<Account[]> {
  return this.httpClient.get(this._endpoint + 'account?filter=type_id||eq||14&or=isDepot||eq||1&sort=name,ASC').pipe(map((value: any) => {
    return <Account[]>value;
  }));
}


getAllSIC(): Observable<SIC[]> {
  return this.httpClient.get(this._endpoint + 'sic').pipe(map((value: any) => {
    return <SIC[]>value;
  }));
}


getAllTips(): Observable<Account[]> {
  return this.httpClient.get(this._endpoint + 'account?filter=type_id||eq||15&or=isTip||eq||1&sort=name,ASC').pipe(map((value: any) => {
    return <Account[]>value;
  }));
}

getAllTippingPrices(siteId: number): Observable<TippingPrice[]> {

  if(!siteId || siteId <= 0) {
    throw new Error('must supply siteid in getAllTippingPrices');
  }
  return this.httpClient.get(this._endpoint + 'tipping-prices?filter=siteId||eq||' + siteId).pipe(map((data) => {
    return <TippingPrice[]>data;
  }))
}

getTippingPriceById(id: number): Observable<TippingPrice[]> {

  if(!id || id <= 0) {
    throw new Error('must supply id in getTippingPriceById');
  }
  return this.httpClient.get(this._endpoint + 'tipping-prices?filter=id||eq||' + id).pipe(map((data) => {
    return <TippingPrice[]>data;
  }))
}

getTipPriceForSiteAndGrade(siteId: number, gradeId: number, jobDate: string): Observable<TippingPrice> {
  if(!siteId || siteId <= 0) {
    throw new Error('Site id must be valid in getAllTipPriceForSiteAndGrade');
  }

  if(!gradeId || gradeId <= 0) {
    throw new Error('grade id must be valid in getAllTipPriceForSiteAndGrade');
  }

  return this.httpClient.get(this._endpoint + 'tipping-prices?filter=siteId||eq||' + siteId + '&filter=gradeId||eq||' + gradeId + '').pipe(map((data: TippingPrice[]) => {
    // Return price effective for now
    let item = data.reduce((a, b) => {
      const adiff = (a.effectiveDate as any - <any>(jobDate));

      const dateCheck = adiff > 0 && adiff < (b.effectiveDate as any - <any>jobDate);

      return dateCheck ? a : b;
    });


    return !item[0] ? null : item[0];

  }))
}

deleteTippingPrices(id: number) {
  if(!id || id <= 0) {
    throw new Error("Can only delete an existing object on deleteTippingPrices");
  }

  return this.httpClient.delete(this._endpoint + 'tipping-prices/' + id);
}

createBulkTippingPrices(tippingPrices: TippingPrice[]): Observable<TippingPrice[]> {

  if (!tippingPrices) {
    throw new Error('You must provide tipping prices for createBulkTippingPrices');
  }

  tippingPrices.forEach((line) => {
    if (line.siteId === -1 || line.siteId === undefined || line.siteId === null) {
      throw new Error('tipping price siteid must be set');
    }

    // if new record drop the id
    if(line.id === -1) {
      delete line.id;
    }

    delete line.createdAt;
    delete line.updatedAt;
  })

  return this.httpClient.post(this._endpoint + 'tipping-prices/bulk', { "bulk": tippingPrices }).pipe(map((value: any) => {
    return <TippingPrice[]>value;
  }));

}

getAllCustomerDetails(accountId: number): Observable<CustomerDetails> {

  if(!accountId || accountId === -1) {
    throw new Error('Account id needs to be valid on getAllCustomerDetails');
  }

  return this.httpClient.get(this._endpoint + 'customer-details?filter=accountId||eq||'+ accountId).pipe(map((details) => {
    return <CustomerDetails>details;
  }))
}



/**
  * creates a customer details record in the backend based on customer details object.
  * @param CustomerDetails customerDetails object.
  *
  * @returns Observable<CustomerDetails>
  */
 createCustomerDetails(customerDetails: CustomerDetails): Observable<CustomerDetails> {


  if(!customerDetails) {
    throw new Error('acount service: you must supply a customer details object for saving');
  }

  delete customerDetails.createdAt;
  delete customerDetails.updatedAt;

  if(customerDetails.id > 0) {
    throw new Error('account service: Cannot create a existing customer details object');
  }

  delete customerDetails.id;
  return this.httpClient.post(this._endpoint + 'customer-details',
  JSON.stringify(customerDetails),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <CustomerDetails>data;
  }));
}


/**
 * updates customer details in the backend based on customer details object.
 * @param CustomerDetails customerDetails object.
 *
 * @returns Observable<CustomerDetails>
 */
updateCustomerDetails(customerDetails: CustomerDetails): Observable<CustomerDetails> {


  if(!customerDetails) {
    throw new Error('account service: you must supply a customer details object for saving');
  }

  delete customerDetails.createdAt;
  delete customerDetails.updatedAt;


  if(!customerDetails.id || customerDetails.id === -1) {
    throw new Error('account service: Cannot update an customer details record without id');
  }

  return this.httpClient.put(this._endpoint + 'customer-details/' + customerDetails.id,
  JSON.stringify(customerDetails),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <CustomerDetails>data;
  }));
}

getAllCustomerCategories(): Observable<CustomerCategory[]> {
  return this.httpClient.get(this._endpoint + 'customer-category?sort=name,ASC').pipe(map((data) => {
    return <CustomerCategory[]>data;
}));
}

getAllTipDetails(accountId: number): Observable<TipDetails> {

  if(!accountId || accountId === -1) {
    throw new Error('Account id needs to be valid on getAllTipDetails');
  }

  return this.httpClient.get(this._endpoint + 'tip-details?filter=tipId||eq||'+ accountId).pipe(map((details) => {
    return <TipDetails>details;
  }))
}


getCreditLimit(accountId: number): Observable<CreditLimit> {

  if(!accountId || accountId === -1) {
    throw new Error('Account id needs to be valid on getCreditLimit');
  }

  return this.httpClient.get(this._endpoint + 'credit-limit?filter=accountId||eq||'+ accountId).pipe(map((details) => {
    return <CreditLimit>details;
  }))
}

/**
  * creates a tip details record in the backend based on tip details object.
  * @param TipDetails tipDetails object.
  *
  * @returns Observable<TipDetails>
  */
 createTipDetails(tipDetails: TipDetails): Observable<TipDetails> {


  if(!tipDetails) {
    throw new Error('acount service: you must supply a tip details object for saving');
  }

  delete tipDetails.createdAt;
  delete tipDetails.updatedAt;

  if(tipDetails.id > 0) {
    throw new Error('account service: Cannot create a existing tip details object');
  }

  delete tipDetails.id;
  return this.httpClient.post(this._endpoint + 'tip-details',
  JSON.stringify(tipDetails),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <TipDetails>data;
  }));
}


/**
 * updates tip details in the backend based on tip details object.
 * @param TipDetails TipDetails object.
 *
 * @returns Observable<TipDetails>
 */
updateTipDetails(tipDetails: TipDetails): Observable<TipDetails> {


  if(!tipDetails) {
    throw new Error('account service: you must supply a tip details object for saving');
  }

  delete tipDetails.createdAt;
  delete tipDetails.updatedAt;


  if(!tipDetails.id || tipDetails.id === -1) {
    throw new Error('account service: Cannot update an tip details record without id');
  }

  return this.httpClient.put(this._endpoint + 'tip-details/' + tipDetails.id,
  JSON.stringify(tipDetails),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <TipDetails>data;
  }));
}

getAllDepotDetails(accountId: number): Observable<DepotDetails> {

  if(!accountId || accountId === -1) {
    throw new Error('Account id needs to be valid on getAllDepotDetails');
  }

  return this.httpClient.get(this._endpoint + 'depot-details?filter=depotId||eq||'+ accountId).pipe(map((details) => {
    return <DepotDetails>details;
  }))
}

/**
  * creates a depot details record in the backend based on depot details object.
  * @param TipDetails depotDetails object.
  *
  * @returns Observable<DepotDetails>
  */
 createDepotDetails(depotDetails: DepotDetails): Observable<DepotDetails> {


  if(!depotDetails) {
    throw new Error('acount service: you must supply a tip details object for saving');
  }

  delete depotDetails.createdAt;
  delete depotDetails.updatedAt;

  if(depotDetails.id > 0) {
    throw new Error('account service: Cannot create a existing tip details object');
  }

  delete depotDetails.id;
  return this.httpClient.post(this._endpoint + 'depot-details',
  JSON.stringify(depotDetails),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <DepotDetails>data;
  }));
}


/**
 * updates depot details in the backend based on depot details object.
 * @param DepotDetails DepotDetails object.
 *
 * @returns Observable<DepotDetails>
 */
updateDepotDetails(depotDetails: DepotDetails): Observable<DepotDetails> {


  if(!depotDetails) {
    throw new Error('account service: you must supply a depot details object for saving');
  }

  delete depotDetails.createdAt;
  delete depotDetails.updatedAt;


  if(!depotDetails.id || depotDetails.id === -1) {
    throw new Error('account service: Cannot update an depot details record without id');
  }

  return this.httpClient.put(this._endpoint + 'depot-details/' + depotDetails.id,
  JSON.stringify(depotDetails),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <DepotDetails>data;
  }));
}

getCountForProspectsByMonthAndYear(month:string, year:string) {
  return this.httpClient.get(this._endpoint + 'account?fields=id&filter=accountRef||cont||' + "Prospect-" + month + '-' + year);
}


  getAllCustomers() {
    return this.httpClient.get(this._endpoint + 'account?filter=type_id||eq||3&or=type_id||eq||16').pipe(map((value: any) => {
      return <Account>value;
    }));
  }
}
