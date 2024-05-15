import { Component, Input, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { DriverAbsenceType } from 'src/app/driver/models/driver-absence-type.model';
import { Driver } from 'src/app/driver/models/driver.model';
import { FitterAbsenceType } from '../../models/fitter-absence-type.model';
import { FitterAbsence } from '../../models/fitter-absence.model';
import { Fitter } from '../../models/fitter.model';
import { FitterAbsenceService } from '../../services/fitter-absence.service';
import { FitterService } from '../../services/fitter.service';

@Component({
  selector: 'app-fitter-absence-form',
  templateUrl: './fitter-absence-form.component.html',
  styleUrls: ['./fitter-absence-form.component.scss']
})
export class FitterAbsenceFormComponent implements OnInit {

  @Input()
  fitterAbsence: FitterAbsence = new FitterAbsence();

  types: FitterAbsenceType[] = [];

  fitters: Fitter[] = [];

  constructor(private fitterService: FitterService,
    private fitterAbsenceService: FitterAbsenceService) { }

  ngOnInit(): void {
    this.fitterService.getAllFitters()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('fitters could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((fitters: Fitter[]) => {
      this.fitters = fitters;
    });

    this.fitterAbsenceService.getAllFitterAbsenceTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('fitter absence types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: FitterAbsenceType[]) => {
      this.types = types;
    });
  }


}
