import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lead } from '../../models/leads.model';
import { LeadService } from '../../services/lead.service';
import { catchError, take } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-edit-leads',
  templateUrl: './edit-leads.component.html',
  styleUrls: ['./edit-leads.component.scss']
})
export class EditLeadsComponent implements OnInit {
  lead: Lead = new Lead();

  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private leadService: LeadService
) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadLead(+params['id']);
    })
  }

  loadLead(id:number){
    if(!id || id === -1) {
      alert('Must have a valid id for job');
      return;
    }

    this.leadService.getLeadById(id)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot recover Lead');return e;
    }))
    .pipe(take(1))
    .subscribe((lead: Lead) =>{
      this.lead = lead;
    })
  }

  save(){
    if(this.validate){
      if(this.lead.account === undefined){
        this.lead.account = new Account();
      }
      this.leadService.saveLead(this.lead)
      .pipe(catchError((e)=>{
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not save Lead');return e;
      }))
      .pipe(take(1))
      .subscribe((item:any)=>{
        // alert('success')
        this.router.navigateByUrl('leads');
      })
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
