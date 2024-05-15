import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Contract } from '../models/contract.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ContractType } from '../models/contract-type.model';
import { ContractStatus } from '../models/contract-status.model';
import { ContractProduct } from '../models/contract-product.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

 getContractById(id: number): Observable<Contract> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('ContractService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'contract/' + id).pipe(map((value: any) => {
    return <Contract>value;
 }));
}


 getAllByAccountId(id: number): Observable<Contract[]> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('ContractService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'contract?filter=accountId||eq||' + id).pipe(map((value: any) => {
    return <Contract[]>value;
 }));
}



deleteContractProductById(contractProductId: number) {
  if(!contractProductId || contractProductId <= 0) {
    throw new Error('You must provide a valid contractProductId when deleting');
  }

  return this.httpClient.delete(this._endpoint + 'contract-product/deleteAllByContractId/' + contractProductId);
}

createBulkContractProducts(contractProducts: ContractProduct[]): Observable<ContractProduct[]> {

  if (!contractProducts) {
    throw new Error('You must provide contractProducts for createBulkContractProducts');
  }

  contractProducts.forEach((line) => {
    if (line.contractId === -1 || line.contractId === undefined || line.contractId === null) {
      throw new Error('contract product contract id must be set');
    }

    if(line.id === -1) {
      delete line.id;
    }

    delete line.createdAt;
    delete line.updatedAt;
  })

  return this.httpClient.post(this._endpoint + 'contract-product/bulk', { "bulk": contractProducts }).pipe(map((value: any) => {
    return <ContractProduct[]>value;
  }));
}


deleteContractProductsForContractId(contractId: number) {
  if (!contractId) {
    throw new Error('You must provide contractId for deleteContractProductsForContractId');
  }

  return this.httpClient.request('delete', this._endpoint + 'contract-product/deleteAllByContractId/' + contractId);

}

getAllContractProducts(contractId: number) {
  if (!contractId) {
    throw new Error('You must provide contractId for getAllContractProducts');
  }

  return this.httpClient.get(this._endpoint + 'contract-product?filter=contractId||eq||' + contractId);
}

createContract(contract: Contract): Observable<Contract> {


  if(!contract) {
    throw new Error('contract service: you must supply a contract object for saving');
  }

  delete contract.createdAt;
  delete contract.updatedAt;

  if(contract.id > 0) {
    throw new Error('contract service: Cannot create a existing object');
  }

  delete contract.id;
  return this.httpClient.post(this._endpoint + 'contract',
  JSON.stringify(contract),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Contract>data;
  }));
}

updateContract(contract: Contract): Observable<Contract> {


  if(!contract) {
    throw new Error('contract service: you must supply a contract object for saving');
  }

  delete contract.createdAt;
  delete contract.updatedAt;

  if(!contract.id || contract.id === -1) {
    throw new Error('contract service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'contract/' + contract.id,
  JSON.stringify(contract),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Contract>data;
  }));
}

  getAllTypes(): Observable<ContractType[]> {
    return this.httpClient.get(this._endpoint + 'contract-type').pipe(map((data) => {
      return <ContractType[]>data;
    }));
  }


  getAllStatus(): Observable<ContractStatus[]> {
    return this.httpClient.get(this._endpoint + 'contract-status').pipe(map((data) => {
      return <ContractType[]>data;
    }));
  }

  generateContractPDF(data: any) {
    data.startDate = moment(data.startDate,'YYYY-MM-DD').format('DD/MM/YYYY');
    data.endDate = moment(data.endDate,'YYYY-MM-DD').format('DD/MM/YYYY');
    
    return this.httpClient.post(this._endpoint + 'contract/contract-pdf',JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}});

  }
}
