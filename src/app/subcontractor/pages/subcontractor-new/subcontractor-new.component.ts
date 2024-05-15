import { Component, OnInit } from '@angular/core';
import { Subcontractor } from '../../models/subcontractor.model';
import { SubcontractorService } from '../../services/subcontractor.service';
import { SubcontractorValidatorService } from '../../validators/subcontractor-validator.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-subcontractor-new',
  templateUrl: './subcontractor-new.component.html',
  styleUrls: ['./subcontractor-new.component.scss']
})
export class SubcontractorNewComponent implements OnInit {

  subcontractor: Subcontractor = new Subcontractor();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private subcontractorValidatorService: SubcontractorValidatorService,
    private subcontractorService: SubcontractorService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.subcontractorValidatorService.isValid(this.subcontractor)) {
      // try to save it
      this.subcontractorService.createSubcontractor(this.subcontractor)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/subcontractors';
      })
    } else {
      this.isError = true;
    }
  }


}
