import { Component, OnInit } from '@angular/core';
import { EnvironmentSettings } from '../../models/environment-settings.model';
import { EnvironmentService } from '../../services/environment.service';
import { catchError, take } from 'rxjs/operators';
import { EnvironmentValidatorService } from '../../validators/environment-validator.service';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.scss']
})
export class EnvironmentComponent implements OnInit {
  environment:EnvironmentSettings = new EnvironmentSettings();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(
    private environmentService:EnvironmentService,
    private environmentValidator: EnvironmentValidatorService
  ) { }

  ngOnInit(): void {
    this.environmentService.getEnvironmentById(1)
    .pipe(catchError((e)=>{alert('Could not get settings');return e;}))
    .pipe(take(1))
    .subscribe((env:EnvironmentSettings) => {
      if(env[0] === undefined){
        this.environment = new EnvironmentSettings();
      } else {
        this.environment = env[0];
      }

    })
  }

  save(){
    this.environment.organisationId = 1;

    this.isError = false;
    this.isServerError = false;

    if(this.environmentValidator.isValid(this.environment)) {
      // try to save it

      if(this.environment.id === -1 || this.environment.id === undefined || this.environment.id === null){
        // Save fresh one
        this.environmentService.newEnv(this.environment)
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
        // update that stuff
        this.environmentService.updateEnv(this.environment)
        .pipe(take(1))
        .pipe(catchError((e) => {
          this.isServerError = true;
          return e;
        }))
        .subscribe(() => {
          // move to edit mode
          this.isSuccess = true;
        })
      }
    } else {
      this.isError = true;
    }
  }

}
