import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/contact.model';
import {ContactValidatorService} from '../../validators/contact-validator.service';
import { ContactService } from '../../service/contact.service';
import { take, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/account/services/account.service';

@Component({
  selector: 'app-contact-new',
  templateUrl: './contact-new.component.html',
  styleUrls: ['./contact-new.component.scss']
})
export class ContactNewComponent implements OnInit {

  contact: Contact = new Contact();
  isError: boolean = false;
  isServerError: boolean = false;

  constructor(
    private contactValidator: ContactValidatorService,
    private contactService: ContactService,
    private accountService: AccountService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      if(params['id'] !== undefined){
        if(params['id'] !== -1){
          this.accountService.getAccountById(+params['id'])
          .pipe(take(1))
          .pipe(catchError((e) => {
            this.isServerError = true;
            return e;
          }))
          .subscribe((account: any)=>{
            this.contact.accounts.push(account)
          })
        }
      }
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;
    if(this.contactValidator.isValid(this.contact)) {


      // try to save it
      this.contactService.createContact(this.contact)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/contacts';
      })
    } else {
      this.isError = true;
    }
  }

}
