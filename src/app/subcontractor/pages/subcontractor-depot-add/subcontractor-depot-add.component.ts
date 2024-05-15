import { Component, OnInit } from '@angular/core';
import { Subcontractor } from '../../models/subcontractor.model';
import { SubcontractorValidatorService } from '../../validators/subcontractor-validator.service';
import { SubcontractorService } from '../../services/subcontractor.service';
import { take, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subcontractor-depot-add',
  templateUrl: './subcontractor-depot-add.component.html',
  styleUrls: ['./subcontractor-depot-add.component.scss']
})
export class SubcontractorDepotAddComponent implements OnInit {

  isError: boolean = false;
  isServerError: boolean = false;
  subcontractor: Subcontractor = new Subcontractor();
  constructor(private subcontractorValidatorService: SubcontractorValidatorService,
    private route: ActivatedRoute,
    private subcontractorService: SubcontractorService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.subcontractor.parentId = +params['id'];
      this.subcontractor.subcontractorTypeId = 2; // depot
    })
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
