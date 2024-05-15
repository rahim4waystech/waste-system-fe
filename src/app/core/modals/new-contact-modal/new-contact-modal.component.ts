import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ContactRole } from 'src/app/contact/models/contact-role.model';
import { Contact } from 'src/app/contact/models/contact.model';
import { ContactService } from 'src/app/contact/service/contact.service';
import { ContactValidatorService } from 'src/app/contact/validators/contact-validator.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-new-contact-modal',
  templateUrl: './new-contact-modal.component.html',
  styleUrls: ['./new-contact-modal.component.scss']
})
export class NewContactModalComponent implements OnInit {

  contact:Contact = new Contact();
  roles: ContactRole[] = [];

  @Output()
  selectedContact: EventEmitter<Contact> = new EventEmitter();

  constructor(
    private contactService: ContactService,
    private contactValidator: ContactValidatorService,
    private modalService: ModalService
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

  close() {
    this.modalService.close('newContactModal');
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
        this.selectedContact.emit(JSON.parse(JSON.stringify(contact)));
        this.modalService.close('newContactModal');
      })
    } else {
      alert('Please fill in all details');
    }
  }
}
