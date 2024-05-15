import { Component, OnInit } from '@angular/core';
import { WorkshopSubcontractors } from '../../models/workshop-subcontractors.model';
import { WorkshopSubcontractorsService } from '../../services/workshop-subcontractors.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-new-workshop-subcontractor',
  templateUrl: './new-workshop-subcontractor.component.html',
  styleUrls: ['./new-workshop-subcontractor.component.scss']
})
export class NewWorkshopSubcontractorComponent implements OnInit {
  workshopSubcontractor: WorkshopSubcontractors = new WorkshopSubcontractors();
  subcontractorId: number = -1;
  isEditable: boolean = false;

  constructor(
    private subcontractorService: WorkshopSubcontractorsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if(parseInt(params['id'],10)){
        this.isEditable = false;
        this.subcontractorId = parseInt(params['id'],10);

        this.subcontractorService.getSubcontractorById(parseInt(params['id'],10))
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Subcontractor or Depot');return e;}))
        .pipe(take(1))
        .subscribe(subbie => {
          this.workshopSubcontractor = subbie[0];
        })
      } else {
        this.isEditable = true;
      }
    })
  }


  save(){
    if(this.validate()){
      this.subcontractorService.createSubbie(this.workshopSubcontractor)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Subcontractor or Depot');return e;}))
      .pipe(take(1))
      .subscribe((data:any)=> {
        const newId = data.id;
        this.router.navigateByUrl('/4workshop/subcontractors/' + newId);
      })
    } else {
      alert('please fill in all fields marked with a red icon')
    }
  }

  cancel(){
    this.router.navigateByUrl('/4workshop/subcontractors')
  }

  validate(){
    let result = true;

    if(
      this.workshopSubcontractor.name === '' ||
      this.workshopSubcontractor.name === ' ' ||
      this.workshopSubcontractor.name.length === 0
    ){result = false;}

    if(
      this.workshopSubcontractor.name === '' ||
      this.workshopSubcontractor.name === ' ' ||
      this.workshopSubcontractor.name.length === 0
    ){result = false;}

    if(
      this.workshopSubcontractor.city === '' ||
      this.workshopSubcontractor.city === ' ' ||
      this.workshopSubcontractor.city.length === 0
    ){result = false;}

    if(
      this.workshopSubcontractor.postcode === '' ||
      this.workshopSubcontractor.postcode === ' ' ||
      this.workshopSubcontractor.postcode.length === 0
    ){result = false;}

    if(
      this.workshopSubcontractor.postcode === '' ||
      this.workshopSubcontractor.postcode === ' ' ||
      this.workshopSubcontractor.postcode.length === 0
    ){result = false;}

    return result;
  }
}
