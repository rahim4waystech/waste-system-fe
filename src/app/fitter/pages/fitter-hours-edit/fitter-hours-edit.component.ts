import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { FitterHours } from '../../models/fitter-hours.model';
import { FitterHourService } from '../../services/fitter-hour.service';
import { FitterHoursValidatorService } from '../../validators/fitter-hours-validator.service';

@Component({
  selector: 'app-fitter-hours-edit',
  templateUrl: './fitter-hours-edit.component.html',
  styleUrls: ['./fitter-hours-edit.component.scss']
})
export class FitterHoursEditComponent implements OnInit {


  fitterHours: FitterHours = new FitterHours();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private fitterHoursValidatorService: FitterHoursValidatorService,
    private fitterHoursService: FitterHourService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadFitterHours(+params['id']);
    })
  }

  loadFitterHours(id: number): void {
    this.fitterHoursService.getFitterHoursById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((fitterHours: FitterHours) => {
      this.fitterHours = fitterHours;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fitterHoursValidatorService.isValid(this.fitterHours)) {
      // try to save it
      this.fitterHoursService.updateFitterHours(this.fitterHours)
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
