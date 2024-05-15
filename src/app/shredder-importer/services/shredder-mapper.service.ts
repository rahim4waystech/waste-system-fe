import { Injectable } from '@angular/core';
import { Account } from 'src/app/order/models/account.model';
import { Contact } from 'src/app/contact/models/contact.model';
import { ContactNewComponent } from 'src/app/contact/pages/contact-new/contact-new.component';

@Injectable({
  providedIn: 'root'
})
export class ShredderMapperService {

  constructor() { }

  mapRowToAccount(row: any[]) {
    const account = new Account();

    account.name = row[0];
    account.contact = row[1];
    account.phoneNumber = row[2];
    account.billingAddress1 = row[3];
    account.billingAddress2 = row[4] + ' ' + row[5];
    account.billingCity = row[6];
    account.billingCountry = "UK";
    account.billingPostCode = row[8];
    account.shippingAddress1 = row[3];
    account.shippingAddress2 = row[4] + ' ' + row[5];
    account.shippingCity = row[6];
    account.shippingCountry = "UK";
    account.shippingPostCode = row[8];
    account.notes = row[19];
    account.website = row[22];
    account.source = "Import excel sheet";



    return account;
  }

  mapToContact(account: Account, row: any[]) {
    const contact = new Contact();
    contact.accounts = [];
    contact.accounts.push(account);
    contact.title = '';
    contact.firstName = row[17]
    contact.lastName = row[18];
    contact.mobile = row[11];
    contact.homePhone = row[2];
    contact.jobTitle = row[14];
    contact.remarks = row[19];

    return contact;
  }
}
