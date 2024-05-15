import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Lead } from '../../models/leads.model';
import { UserService } from 'src/app/user/services/user.service';
import { take, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AccountService } from 'src/app/account/services/account.service';
import { ContactService } from 'src/app/contact/service/contact.service';
import { LeadService } from '../../services/lead.service';
import { Contact } from 'src/app/contact/models/contact.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { IncumbentService } from 'src/app/account/services/incumbent.service';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss']
})
export class LeadFormComponent implements OnInit {
  @Input()
  lead: Lead = new Lead();

  currentUser: any = {};
  users: any = [];
  accounts: any = [];
  types: any = [];
  statuses: any = [];
  contacts: any = [];
  incumbents: any = [];
  contactName: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private accountService:AccountService,
    private contactService:ContactService,
    private leadService: LeadService,
    private incumbentService:IncumbentService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.lead.ownerId = this.currentUser.id;
    this.lead.owner.id = this.currentUser.id;

    this.userService.getAllActiveUsers()
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not retrieve Users');return e;
    }))
    .pipe(take(1))
    .subscribe(users => {
      this.users = users;
    })

    this.accountService.getAccountRatings()
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not retrieve Lead Types');return e;
    }))
    .pipe(take(1))
    .subscribe(types => {
      this.types = types;
    })

    this.leadService.getLeadStatus()
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not retrieve Lead Statuses');return e;
    }))
    .pipe(take(1))
    .subscribe(status => {
      this.statuses = status;
    })

    // this.getContacts();
  }

  ngOnChanges(changes: SimpleChanges){

    // Set sites account id
    if(changes.lead) {
      if(this.lead.contactId !== -1 && this.lead.contactId !== null){
        this.contactName = this.lead.contact.firstName + ' ' + this.lead.contact.lastName;
      }
      this.getIncumbents();


    }
  }

  openModal(name: string) {
    this.modalService.open(name);
  }

  // getContacts(){
  //   this.contacts = [];
  //   this.contactService.getAllContacts()
  //   .pipe(catchError((e)=>{alert('Could not retrieve Lead Statuses');return e;}))
  //   .pipe(take(1))
  //   .subscribe(contacts => {
  //     this.contacts = contacts;
  //   })
  // }

  changeOwner(event){
    const ownerId = parseInt(event.target.value,10);
    this.lead.ownerId = ownerId;
    this.lead.owner.id = ownerId;
  }

  changeAccount(event){
    const accountId = parseInt(event.target.value,10);
    this.lead.accountId = accountId;
    this.lead.account.id = accountId
    this.getIncumbents();
    // this.getContacts();
  }

  changeType(event){
    const typeId = parseInt(event.target.value,10);
    this.lead.typeId = typeId;
    this.lead.type.id = typeId;
  }

  changeStatus(event){
    const statusId = parseInt(event.target.value,10);
    this.lead.statusId = statusId;
    this.lead.status.id = statusId;
  }

  changeContact(event){
    this.lead.contact = new Contact();
    const contactId = parseInt(event.target.value,10);
    this.lead.contactId = contactId;
    this.lead.contact.id = contactId;
  }

  onSelectedAccounts($event: any) {
    this.lead.accountId = $event.id;
    this.lead.account = $event;
    this.getIncumbents();
    // this.getContacts();
  }

  onSelectedContacts($event: any) {
    this.lead.contactId = $event.id;
    this.lead.contact = $event;

    this.lead.leadNotes = $event.notes;
    this.lead.phone = $event.phoneNumber;
    this.lead.email = $event.email;
    this.contactName = $event.firstName + ' ' + $event.lastName;

    // this.getContacts();
  }

  getIncumbents(){
    this.incumbents = [];
    this.incumbentService.getIncumbentsByAccountId(this.lead.accountId)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get incumbents');return e;
    }))
    .pipe(take(1))
    .subscribe(incumbents => {
      this.incumbents = incumbents;
    })
  }

  newContact(){
    alert('open modal')
  }


    deleteContact(){
      if(confirm('Are you sure you want to remove this Contact?')){
        this.lead.contact = new Contact();
        const contactId = -1;
        this.lead.contactId = contactId;
        this.lead.contact.id = contactId;
      }
    }

    deleteAccount(){
      if(confirm('Are you sure you want to remove this Account?')){
        this.lead.accountId = -1;
        this.lead.account = new Account();
      }
    }

}
