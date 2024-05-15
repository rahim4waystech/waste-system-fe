import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Fitter } from '../../models/fitter.model';
import { FitterValidatorService } from '../../validators/fitter-validator.service';
import { FitterService } from '../../services/fitter.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-fitter-edit',
  templateUrl: './fitter-edit.component.html',
  styleUrls: ['./fitter-edit.component.scss']
})
export class FitterEditComponent implements OnInit {

  fitter: Fitter = new Fitter();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private fitterValidatorService: FitterValidatorService,
    private fitterService: FitterService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadFitter(+params['id']);
    })
  }

  loadFitter(id: number): void {
    this.fitterService.getFitterById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((fitter: Fitter) => {
      this.fitter = fitter;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fitterValidatorService.isValid(this.fitter)) {
      // try to save it
      this.fitterService.updateFitter(this.fitter)
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
