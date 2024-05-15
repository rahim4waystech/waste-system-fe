import { Component, OnInit } from '@angular/core';
import { Fitter } from '../../models/fitter.model';
import { FitterService } from '../../services/fitter.service';
import { take, catchError } from 'rxjs/operators';
import { DriverValidatorService } from 'src/app/driver/validators/driver-validator.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { FitterValidatorService } from '../../validators/fitter-validator.service';

@Component({
  selector: 'app-fitter-new',
  templateUrl: './fitter-new.component.html',
  styleUrls: ['./fitter-new.component.scss']
})
export class FitterNewComponent implements OnInit {

  fitter: Fitter = new Fitter();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private fitterValidatorService: FitterValidatorService,
    private fitterService: FitterService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let data: any = [];
    this.isError = false;
    this.isServerError = false;

    if (this.fitterValidatorService.isValid(this.fitter)) {
      // try to save it

      this.fitterService.createFitter(this.fitter)
        .pipe(take(1))
        .pipe(catchError((e) => {
          this.isServerError = true;
          return e;
        }))
        .subscribe(() => {
          // move to edit mode
          window.location.href = '/4workshop/fitters';
        })
    } else {
      this.isError = true;
    }
  }
}
