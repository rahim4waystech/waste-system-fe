import { Component, OnInit } from '@angular/core';
import { Subcontractor } from '../../models/subcontractor.model';
import { ActivatedRoute } from '@angular/router';
import { SubcontractorValidatorService } from '../../validators/subcontractor-validator.service';
import { SubcontractorService } from '../../services/subcontractor.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-subcontractor-depot-edit',
  templateUrl: './subcontractor-depot-edit.component.html',
  styleUrls: ['./subcontractor-depot-edit.component.scss']
})
export class SubcontractorDepotEditComponent implements OnInit {

  subcontractor: Subcontractor = new Subcontractor();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private subcontractorValidator: SubcontractorValidatorService,
    private subcontractorService: SubcontractorService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadSubcontractor(+params['id']);
    })
  }

  loadSubcontractor(id: number): void {
    this.subcontractorService.getSubcontractorById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((subcontractor: Subcontractor) => {
      this.subcontractor = subcontractor;

      this.subcontractor.subcontractorTypeId = 2; //force it to always be depot from this screen.
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.subcontractorValidator.isValid(this.subcontractor)) {
      // try to save it
      this.subcontractorService.updateSubcontractor(this.subcontractor)
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
