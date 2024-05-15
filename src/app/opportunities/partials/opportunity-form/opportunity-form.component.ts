import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Opportunity } from '../../models/opportunity.model';
import { AccountService } from 'src/app/account/services/account.service';
import { catchError, take } from 'rxjs/operators';
import { LeadService } from 'src/app/leads/services/lead.service';
import { UserService } from 'src/app/user/services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { IncumbentService } from 'src/app/account/services/incumbent.service';
import { Contact } from 'src/app/contact/models/contact.model';
import { ContactService } from 'src/app/contact/service/contact.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-opportunity-form',
  templateUrl: './opportunity-form.component.html',
  styleUrls: ['./opportunity-form.component.scss']
})
export class OpportunityFormComponent implements OnInit {
  @Input()
  opportunity: Opportunity = new Opportunity();
  @Input()
  accountId:number = -1;
  accounts: any = [];
  contacts: any = [];
  leads: any = [];
  users: any = [];
  currentUser: any = {};
  statuses: any = [];
  incumbents: any = [];
  environment = environment;
  contactName: string = '';

  constructor(
    private accountService: AccountService,
    private leadService:LeadService,
    private authService: AuthService,
    private userService: UserService,
    private contactService:ContactService,
    private incumbentService:IncumbentService,
    private modalService: ModalService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.opportunity.ownerId = this.currentUser.id;
    this.opportunity.owner.id = this.currentUser.id;
    // this.accountId = this.opportunity.accountId;

    this.leadService.getLeadStatus()
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not retrieve Lead Statuses');
      return e;
    }))
    .pipe(take(1))
    .subscribe(status => {
      this.statuses = status;
    })

    this.userService.getAllActiveUsers()
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not retrieve Users');
      return e;
    }))
    .pipe(take(1))
    .subscribe(users => {
      this.users = users;
    })

    // this.getContacts();
    this.updateLeads()
  }

  ngOnChanges(changes: SimpleChanges){
    // Set sites account id
    if(changes.accountId){
      if(changes.accountId.currentValue !== -1){


        this.updateLeads();
        this.getIncumbents();
      }
    }

    if(changes.opportunity){
      if(this.opportunity.contactId !== -1 && this.opportunity.contactId !== null){
        this.contactName = this.opportunity.contact.firstName + ' ' + this.opportunity.contact.lastName;
      }
    }

  }

  changeAccount(event){
    this.accountId = parseInt(event.target.value,10);
    this.opportunity.accountId = parseInt(event.target.value,10);
    this.opportunity.account.id = parseInt(event.target.value,10);

    this.updateLeads();
  }

  updateLeads(){
    if(this.accountId !== -1 && this.opportunity.leadId !== null){
      this.leads = [];

      this.leadService.getLeadByAccountId(this.accountId)
      .pipe(catchError((e)=>{
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not retrieve Leads');return e;
      }))
      .pipe(take(1))
      .subscribe(leads => {
        this.leads = leads;
      })
    }
  }

  changeLead(event){
    const leadId = parseInt(event.target.value,10);
    this.opportunity.leadId = leadId;
    this.opportunity.lead = this.leads.filter(f=>f.id === leadId)[0];
  }

  changeStatus(event){
    const statusId = parseInt(event.target.value,10);
    this.opportunity.statusId = statusId;
    this.opportunity.status.id = statusId;
  }

  changeOwner(event){
    const ownerId = parseInt(event.target.value,10);
    this.opportunity.ownerId = ownerId;
    this.opportunity.owner.id = ownerId;
  }

  changeContact(event){
    this.opportunity.contact = new Contact();
    const contactId = parseInt(event.target.value,10);
    this.opportunity.contactId = contactId;
    this.opportunity.contact.id = contactId;
  }

  deleteContact(){
    if(confirm('Are you sure you want to remove this Contact?')){
      this.opportunity.contact = new Contact();
      const contactId = -1;
      this.opportunity.contactId = contactId;
      this.opportunity.contact.id = contactId;
    }
  }

  deleteAccount(){
    if(confirm('Are you sure you want to remove this Account?')){
      this.accountId = -1;
      this.opportunity.accountId = -1;
      this.opportunity.account = new Account();
    }
  }


  openModal(name: string) {
    this.modalService.open(name);
  }

  onSelectedAccounts($event: any) {
    this.opportunity.accountId = $event.id;
    this.accountId = $event.id;
    this.opportunity.account = $event;

    this.opportunity.description = $event.notes;
    this.opportunity.email = $event.email;
    this.opportunity.phone = $event.phoneNumber;

    this.getIncumbents();
    this.updateLeads()
  }

  onSelectedContacts($event: any) {
    this.opportunity.contactId = $event.id;
    this.opportunity.contact = $event;
    this.contactName = $event.firstName + ' ' + $event.lastName;

    // this.getContacts();
  }

  getIncumbents(){
    this.incumbents = [];
    if(this.opportunity.lead !== null && this.opportunity.lead !== undefined){
      this.incumbentService.getIncumbentsByAccountId(this.opportunity.accountId)
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

  }

}
