import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OpportunityService } from '../../services/opportunity.service';
import { catchError, take } from 'rxjs/operators';
import { Opportunity } from '../../models/opportunity.model';
import { AccountService } from 'src/app/account/services/account.service';

@Component({
  selector: 'app-edit-opportunities',
  templateUrl: './edit-opportunities.component.html',
  styleUrls: ['./edit-opportunities.component.scss']
})
export class EditOpportunitiesComponent implements OnInit {
  opportunity:Opportunity = new Opportunity();

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private opportunityService: OpportunityService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadOpp(+params['id']);
    })
  }



  loadOpp(id:number){
    if(!id || id === -1) {
      alert('Must have a valid id for Opportunity');
      return;
    }

    this.opportunityService.getOppById(id)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot recover opportunity');return e;
    }))
    .pipe(take(1))
    .subscribe((opportunity: Opportunity) =>{
      this.opportunity = opportunity;
    })
  }

  save(){


    if(this.validate()){

      // is won
      if(this.opportunity.accountId !== -1 && this.opportunity.statusId === 2) {
        // Update account to customer
        this.opportunity.account.type_id = 3;
        this.opportunity.account.type = {id: 3} as any; 
        this.updateAccount();
      } else {
        this.updateOpp();
      }
    }
  }

  updateAccount() {
    this.accountService.updateAccount(this.opportunity.account)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update account');
      return e;
    }))
    .subscribe((data) => {
      this.updateOpp();
    })
  }
  updateOpp() {
    this.opportunityService.updateOpp(this.opportunity)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not update Opportunity');return e;
    }))
    .pipe(take(1))
    .subscribe(()=>{
        this.router.navigateByUrl('opportunities');
    })
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
