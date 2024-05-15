import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Contact } from './../../contact/models/contact.model';
import { ContactRole } from '../models/contact-role.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {



  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a contact from the backend by id
  *
  * @param id number id of contact to get
  *
  * @returns Observable<Account>
  */
 getContactById(id: number): Observable<Contact> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('ContactService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'contact/' + id).pipe(map((value: any) => {
    return <Contact>value;
 }));
}

 /**
  * Get a contact from the backend by id
  *
  * @param id account id of contact to get
  *
  * @returns Observable<Contact>
  */
 getContactsByAccountId(id: number): Observable<Contact> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('ContactService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'contact?filter=accounts.id||eq||' + id).pipe(map((value: any) => {
    return <Contact>value;
 }));
}

 /**
  * Get a all contacts from the backend by id
  * @returns Observable<Contact>
  */
 getAllContacts(): Observable<Contact> {
 return this.httpClient.get(this._endpoint + 'contact').pipe(map((value: any) => {
    return <Contact>value;
 }));
}


/**
 * creates a contact in the backend based on contact object.
 * @param Contact contact object.
 *
 * @returns Observable<Contact>
 */
createContact(contact: Contact): Observable<Contact> {


  if(!contact) {
    throw new Error('contact service: you must supply a contact object for saving');
  }

  delete contact.createdAt;
  delete contact.updatedAt;

  if(contact.id > 0) {
    throw new Error('contact service: Cannot create a existing object');
  }

  delete contact.id;

  return this.httpClient.post(this._endpoint + 'contact',
  JSON.stringify(contact),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Contact>data;
  }));
}


/**
 * updates a contact in the backend based on contact object.
 * @param contact contact object.
 *
 * @returns Observable<Contact>
 */
updateContact(contact: Contact): Observable<Contact> {


  if(!Contact) {
    throw new Error('contact service: you must supply a contact object for saving');
  }

  delete contact.createdAt;
  delete contact.updatedAt;

  if(!contact.id || contact.id === -1) {
    throw new Error('contact service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'contact/' + contact.id,
  JSON.stringify(contact),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <Contact>data;
  }));
}

getAllRoles(): Observable<ContactRole[]> {
  return this.httpClient.get(this._endpoint + 'contact-role').pipe(map((value: any) => {
    return <ContactRole[]>value;
  }));
}

}
