import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { ContactRole } from 'src/app/contact/models/contact-role.model';
import { Contact } from 'src/app/contact/models/contact.model';
import { ContactService } from 'src/app/contact/service/contact.service';
import { ContactValidatorService } from 'src/app/contact/validators/contact-validator.service';
import { GridButton } from '../../models/grid-button.model';
import { GridColumn } from '../../models/grid-column.model';
import { GridFilter } from '../../models/grid-filter.model';
import { GridSearchFilter } from '../../models/grid-search-filter.model';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.scss']
})
export class ContactModalComponent implements OnInit {
  @Output()
  selectedContacts: EventEmitter<Contact> = new EventEmitter();

  newContact: boolean = false;

  contacts: Contact[] = [];
  contact: Contact = new Contact();
  roles: ContactRole[] = [];

  isError:boolean = false;
  isServerError: boolean = false;


  buttons: GridButton[] = [];

  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'First Name', field: 'firstName'} as GridColumn,
    {active: true, label: 'Last Name', field: 'lastName'} as GridColumn,
    {active: true, label: 'Job Title', field: 'jobTitle'} as GridColumn,
    {active: true, label: 'Phone Number', field: 'businessPhone'} as GridColumn,
    {active: true, label: 'Email', field: 'email'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['firstName', 'lastName', 'jobTitle', 'businessPhone', 'email'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'firstName',
      label: 'First Name',
    } as GridSearchFilter,
    {
      field: 'lastName',
      label: 'Last Name',
    } as GridSearchFilter,
    {
      field: 'jobTitle',
      label: 'Job Title',
    } as GridSearchFilter,
    {
      field: 'businessPhone',
      label: 'Phone Number',
    } as GridSearchFilter,
    {
      field: 'email',
      label: 'email',
    } as GridSearchFilter,
  ]

  constructor(
    private modalService: ModalService,
    private contactService: ContactService,
    private contactValidator: ContactValidatorService,
  ) { }

  ngOnInit(): void {
    this.contactService.getAllRoles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load roles');
      return e;
    }))
    .subscribe((data: ContactRole[]) => {
      this.roles = data;
    })
  }

  cancel() {
    this.modalService.close('contactModal');
    this.contacts = [];
  }

  save(){
    if(this.contactValidator.isValid(this.contact)) {
      // try to save it
      this.contactService.createContact(this.contact)
      .pipe(take(1))
      .pipe(catchError((e) => {
        return e;
      }))
      .subscribe((contact:Contact) => {
        this.selectedContacts.emit(JSON.parse(JSON.stringify(contact)));
        this.modalService.close('contactModal');
      })
    } else {
      alert('Please fill in all details');
    }
  }

  onCheckedSelected($event) {
    this.selectedContacts.emit(JSON.parse(JSON.stringify($event)));
    this.cancel();
  }

  openNewContact(){
    this.newContact = true;
  }

  clearNewContact(){
    this.newContact = false;
    this.contact = new Contact();
  }

}
