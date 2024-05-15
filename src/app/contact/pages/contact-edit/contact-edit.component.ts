import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contact.model';
import { ActivatedRoute } from '@angular/router';
import { ContactValidatorService } from '../../validators/contact-validator.service';
import { ContactService } from '../../service/contact.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.scss']
})
export class ContactEditComponent implements OnInit {

  contact: Contact = new Contact();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private contactValidator: ContactValidatorService,
    private contactService: ContactService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadContact(+params['id']);
    })
  }

  loadContact(id: number): void {
    this.contactService.getContactById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((contact: Contact) => {
      this.contact = contact;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;
    if(this.contactValidator.isValid(this.contact)) {
      // try to save it
      this.contactService.updateContact(this.contact)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        this.isSuccess = true;
      })
    } else {
      this.isError = true;
    }
  }

}
