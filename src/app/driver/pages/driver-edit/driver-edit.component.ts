import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DriverValidatorService } from '../../validators/driver-validator.service';
import { DriverService } from '../../services/driver.service';
import { take, catchError } from 'rxjs/operators';
import { Driver } from '../../models/driver.model';

@Component({
  selector: 'app-driver-edit',
  templateUrl: './driver-edit.component.html',
  styleUrls: ['./driver-edit.component.scss']
})
export class DriverEditComponent implements OnInit {

  driver: Driver = new Driver();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private driverValidator: DriverValidatorService,
    private driverService: DriverService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadDriver(+params['id']);
    })
  }

  loadDriver(id: number): void {
    this.driverService.getDriverById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((driver: Driver) => {
      this.driver = driver;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.driverValidator.isValid(this.driver)) {
      // try to save it
      this.driverService.updateDriver(this.driver)
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
