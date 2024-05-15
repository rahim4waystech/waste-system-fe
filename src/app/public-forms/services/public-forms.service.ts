import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from 'src/app/order/models/account.model';
import { Sepa } from 'src/app/account/models/sepa.model';
import { map } from 'rxjs/operators';
import { PublicFormToken } from '../public-form-token.model';
import { PublicFormsModule } from '../public-forms.module';

@Injectable({
  providedIn: 'root'
})
export class PublicFormsService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


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


  return this.httpClient.post(this._endpoint + 'public-form/customer',
  JSON.stringify(account),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Account>data;
  }));
}

  getPublicFormTokenRecordByToken(token: string): Observable<PublicFormToken[]> {
    if(!token || token === '') {
        throw new Error('Token must be supplied in getPublicFormTokenRecordByToken'); 
    }

    return this.httpClient.get(this._endpoint + 'public-form-token?filter=token||eq||' + token)
    .pipe(map((data) => {
      return <PublicFormToken[]>data;
    }));

  }

  deleteTokenById(id: number) {

    return this.httpClient.delete(this._endpoint + 'public-form-token/' + id);

  }


  createToken(token: PublicFormToken): Observable<PublicFormToken> {


  if(!token) {
    throw new Error('token service: you must supply a token object for saving');
  }

  delete token.createdAt;
  delete token.updatedAt;

  if(token.id > 0) {
    throw new Error('token service: Cannot create a existing object');
  }

  delete token.id;



  return this.httpClient.post(this._endpoint + 'public-form-token',
  JSON.stringify(token),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <PublicFormToken>data;
  }));
}




updateToken(token: PublicFormToken): Observable<PublicFormToken> {


  if(!token) {
    throw new Error('token service: you must supply a token object for saving');
  }

  delete token.createdAt;
  delete token.updatedAt;


  if(!token.id || token.id === -1) {
    throw new Error('token service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'public-form-token/' + token.id,
  JSON.stringify(token),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <PublicFormToken>data;
  }));
}

}
