import { Account } from './../../order/models/account.model';
import { ContactRole } from './../models/contact-role.model';

export class Contact {
    id: number = -1;

    organisationId: number = -1;
    accounts: Account[] = [];
    title: string = '';
    firstName: string = '';
    middleName: string = '';
    lastName: string = '';
    jobTitle: string = '';
    businessPhone: string = '';
    role: ContactRole = new ContactRole();
    roleId: number = -1;
    homePhone: string = '';
    mobile: string = '';
    fax: string = '';
    email: string = '';
    address1: string = '';
    address2: string = '';
    address3: string = '';
    city: string = '';
    country: string = '';
    postCode: string = '';
    status: number = -1;
    companyName: string = '';
    remarks: string = '';
    createdBy: number = -1;
    createdAt: string = '';
    updatedAt: string = '';
}
