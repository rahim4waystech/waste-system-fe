import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WorkshopSubcontractorsService } from '../../services/workshop-subcontractors.service';
import { WorkshopSubcontractors } from '../../models/workshop-subcontractors.model';
import { catchError, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subcontractor-form',
  templateUrl: './subcontractor-form.component.html',
  styleUrls: ['./subcontractor-form.component.scss']
})
export class SubcontractorFormComponent implements OnInit {
  @Input()
  workshopSubcontractor:WorkshopSubcontractors = new WorkshopSubcontractors()
  @Input()
  subcontractorId:number = -1;
  @Input()
  editable:boolean = true;

  company = environment.defaults.companyName;
  subcontractors: any = [];
  showDepots: boolean = false;
  isNewSub: boolean = false;
  tempId = null;
  tempName:string = '';

  constructor(
    private subcontractorService: WorkshopSubcontractorsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subcontractorService.getAllSubcontractors()
    .pipe(catchError((e) => {if(e.status === 403 || e.status === 401){return e;}alert('Could not get Subcontractors');return e;}))
    .pipe(take(1))
    .subscribe(subcontractors => {
      this.subcontractors = subcontractors;

      this.handleDropdown();
    })

    if(this.workshopSubcontractor.ownDepot === true){
      this.tempName = environment.defaults.companyName;
    }
  }

  changeSubcontractor(event){
    this.showDepots = false;

    if(event.target.value === 'new'){
      // New Subbie parentid = -1
      this.subcontractorId = parseInt(event.target.value,10);
      this.isNewSub  = true;
      this.workshopSubcontractor.ownDepot = false;
    } else if(event.target.value === 'own'){
      this.subcontractorId = parseInt(event.target.value,10);
      this.tempName = environment.defaults.companyName;

      this.workshopSubcontractor.parentId = parseInt(event.target.value,10);
      this.workshopSubcontractor.ownDepot = true;
      this.isNewSub = false;
    } else if(event.target.value === 'select') {
      alert('Please select an option')
    } else {
      this.subcontractorId = parseInt(event.target.value,10);
      this.isNewSub  = false;
      this.workshopSubcontractor.ownDepot = false;

      this.workshopSubcontractor.parentId = parseInt(event.target.value,10);
    }
    this.showDepots = true;
    this.handleDropdown();
  }

  handleDropdown(){
    if(this.subcontractorId !== -1){
      this.showDepots = true;

      if(this.workshopSubcontractor.parentId !== -1 && this.workshopSubcontractor.parentId !== null){
        const parent = this.workshopSubcontractor.parentId;

        const tempSubbie = this.subcontractors.filter(f=>f.id===parent)[0];
        if(this.subcontractorId === 0 || this.workshopSubcontractor.ownDepot === true){
          this.tempName = environment.defaults.companyName;
        } else {
          this.tempName = tempSubbie.name;
        }
      } else if(this.subcontractorId === 0 || this.workshopSubcontractor.parentId === 0){
        this.tempName = environment.defaults.companyName;
      } else {
        const parent = this.workshopSubcontractor.id;
        const tempSubbie = this.subcontractors.filter(f=>f.id===parent)[0];
        this.tempName = tempSubbie.name;
      }
    }
  }

  foundBillingAddress(event){
    this.workshopSubcontractor.address1 = event.address1;
    this.workshopSubcontractor.address2 = event.address2;
    this.workshopSubcontractor.city = event.city;
  }

}
