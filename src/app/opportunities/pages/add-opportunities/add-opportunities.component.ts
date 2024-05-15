import { Component, OnInit } from '@angular/core';
import { Opportunity } from '../../models/opportunity.model';
import { catchError, take } from 'rxjs/operators';
import { OpportunityService } from '../../services/opportunity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LeadService } from 'src/app/leads/services/lead.service';
import { AccountService } from 'src/app/account/services/account.service';
import { DiscussionService } from 'src/app/core/services/discussion.service';
import { Discussion } from 'src/app/core/models/discussion.model';

@Component({
  selector: 'app-add-opportunities',
  templateUrl: './add-opportunities.component.html',
  styleUrls: ['./add-opportunities.component.scss']
})
export class AddOpportunitiesComponent implements OnInit {
  opportunity: Opportunity = new Opportunity();
  accountId: number = -1;

  constructor(
    private oppService: OpportunityService,
    private router: Router,
    private discussionService: DiscussionService,
    private route: ActivatedRoute,
    private leadService: LeadService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id'] !== undefined){
        if(params['account'] === 'account'){
          this.accountService.getAccountById(params['id'])
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Account');return e;}))
          .pipe(take(1))
          .subscribe((account:any) => {
            this.opportunity.account = account;
            this.opportunity.accountId = account.id;
            this.accountId = account.id;

            this.opportunity.opportunityName = account.name;
            this.opportunity.description = account.notes;
            this.opportunity.email = account.email;
            this.opportunity.phone = account.phoneNumber;

            this.setDecriptionFromDiscussions(account.id);
          })

        } else {
          this.leadService.getLeadById(params['id'])
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Lead');return e;}))
          .pipe(take(1))
          .subscribe((lead:any) => {
            this.opportunity.leadId = lead.id;
            this.opportunity.lead = lead
            this.opportunity.accountId = lead.account.id;
            this.opportunity.account = lead.account;
          })
        }
      }
    })
  }

 
  setDecriptionFromDiscussions(accountId: number) {
    this.discussionService.getDiscussionByEntityNameAndId('account', accountId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not get current discussions');
      return e;
    }))
    .subscribe((discussions: Discussion[]) => {
      let description = '';
      
      discussions.forEach((discussion) => {
        description += discussion.message + '\n';
      });

      this.opportunity.description += description;
    })
  }

  save(){
    if(this.validate()){
      this.oppService.createOpp(this.opportunity)
      .pipe(catchError((e)=>{
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not save Opportunity');return e;
      }))
      .pipe(take(1))
      .subscribe((item:any)=>{
        // if(this.opportunity.statusId === 2){
          // if(this.opportunity.accountId != -1 && this.opportunity.account.type_id === 8) {
          //   this.accountService.getAccountById(this.opportunity.accountId)
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
          //       this.router.navigateByUrl('opportunities');
          //     })
          //   })
          // } else {
            this.router.navigateByUrl('opportunities');
          // }

        // } else {
        //   this.router.navigateByUrl('opportunities');
        // }
      })
    } else {
      alert('Please fill in all marked details')
    }
  }

  cancel(){
    if(confirm('Leave and discard all details?')){
      this.router.navigateByUrl('/opportunities');
    }
  }

  validate(){
    let validate = true;
    let errors = '';

    if(this.opportunity.ownerId <= 0){
      validate = false;
      errors += 'Owner, ';
    }

    if(this.opportunity.opportunityName === "" || this.opportunity.opportunityName.length === 0 || this.opportunity.opportunityName === " "){
      validate = false;
      errors += 'Opportunity Name, ';
    }

    if(this.opportunity.description === "" || this.opportunity.description.length === 0 || this.opportunity.description === " "){
      validate = false;
      errors += 'Description, ';
    }
    if(this.opportunity.statusId === -1){
      validate = false;
      errors += 'Status, ';
    }

    if(this.opportunity.estimatedCloseDate === "" || this.opportunity.estimatedCloseDate.length === 0 || this.opportunity.estimatedCloseDate === " "){
      validate = false;
      errors += 'Est. Close Date, ';
    }

    if(this.opportunity.ownerId < 0){
      validate = false;
      errors += 'Actual Revenue cannot be Negative, ';
    }

    if(!validate){
      alert('Please fill in all Marked items before saving: ' + errors);
    }

    return validate;
  }


}
