import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lead } from '../../models/leads.model';
import { LeadService } from '../../services/lead.service';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';

@Component({
  selector: 'app-add-leads',
  templateUrl: './add-leads.component.html',
  styleUrls: ['./add-leads.component.scss']
})
export class AddLeadsComponent implements OnInit {
  lead: Lead = new Lead();

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private leadService: LeadService,
    private accountService:AccountService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] !== undefined){
        this.accountService.getAccountById(params['id'])
        .pipe(catchError((e)=>{
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not get Account');return e;
          }))
        .pipe(take(1))
        .subscribe((account:any) => {
          this.lead.accountId = account.id;
          this.lead.account = account

          this.lead.leadNotes = account.notes;
          this.lead.phone = account.phoneNumber;
          this.lead.email = account.email;
        })
      }
    })
  }

  save(){
    if(this.validate()){
      this.leadService.createLead(this.lead)
      .pipe(catchError((e)=>{
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not save Lead');return e;
      }))
      .pipe(take(1))
      .subscribe((item:any)=>{
        // if(this.lead.accountId != -1 && this.lead.account.type_id === 8){
        //   this.accountService.getAccountById(this.lead.account.id)
        //   .pipe(catchError((e)=>{alert('Could not Update Account');return e;}))
        //   .pipe(take(1))
        //   .subscribe((account:any) => {
        //     account.type_id = 3;
        //     account.type = {id:3} as any;
        //
        //     this.accountService.updateAccount(account)
        //     .pipe(catchError((e)=>{alert('Could not Update Account');return e;}))
        //     .pipe(take(1))
        //     .subscribe(() => {
        //       this.router.navigateByUrl('leads');
        //     })
        //   })
        // } else {
        //   this.router.navigateByUrl('leads');
        // }
        this.router.navigateByUrl('leads');
      })
    } else {
      alert('Please fill in all marked details')
    }
  }

  cancel(){
    if(confirm('Leave and discard all details?')){
      this.router.navigateByUrl('/leads');
    }
  }

  validate(){
    let validate = true;
    let errors = '';

    if(this.lead.subject === "" || this.lead.subject.length === 0 || this.lead.subject === " "){
      validate = false;
      errors += 'Subject, ';
    }

    if(this.lead.estimatedRevenue < 0){
      validate = false;
      errors += 'Est. Revenue, ';
    }

    if(this.lead.ownerId <= 0){
      validate = false;
      errors += 'Owner, ';
    }

    if(this.lead.typeId === -1){
      validate = false;
      errors += 'Type, ';
    }
    if(this.lead.statusId === -1){
      validate = false;
      errors += 'Status, ';
    }

    if(!validate){
      alert('Please fill in all Marked items before saving: ' + errors);
    }

    return validate;
  }


}
