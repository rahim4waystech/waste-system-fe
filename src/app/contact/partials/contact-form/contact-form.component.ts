import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../service/contact.service';
import { ContactRole } from '../../models/contact-role.model';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from './../../../core/services/modal.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @Input()
  contact: Contact = new Contact();

  roles: ContactRole[] = [];

  constructor(private contactService: ContactService,
    private modalService: ModalService) { }

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

  addressFound(event) {
    this.contact.address1 = event.address1;
    this.contact.address2 = event.address2;
    this.contact.city = event.city;
    this.contact.country = event.country;
  }

  openModal(name: string) {
    this.modalService.open(name);
  }

  onSelectedAccounts($event: any) {

    // add selected accounts to the list
    $event.forEach((account: any) => {
      this.contact.accounts.push(account);
    })
  }

  deleteAccountLink(account: any) {
    this.contact.accounts = this.contact.accounts.filter(a => a.id !== account.id);
  }

 }
