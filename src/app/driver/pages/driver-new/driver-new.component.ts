import { Component, OnInit } from '@angular/core';
import { Driver } from '../../models/driver.model';
import { DriverService } from '../../services/driver.service';
import { take, catchError } from 'rxjs/operators';
import { DriverValidatorService } from '../../validators/driver-validator.service';

@Component({
  selector: 'app-driver-new',
  templateUrl: './driver-new.component.html',
  styleUrls: ['./driver-new.component.scss']
})
export class DriverNewComponent implements OnInit {
  driver: Driver = new Driver();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private driverValidator: DriverValidatorService,
    private driverService: DriverService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    let data: any = [];
    this.isError = false;
    this.isServerError = false;

    if(this.driverValidator.isValid(this.driver)) {
      // try to save it

      this.driverService.driverExists(this.driver.firstName,this.driver.lastName)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(dataResult => {
        data = dataResult;
        if(data.length === 0 || data === undefined){
          this.driverService.employeeNumberExists(this.driver.employeeNumber)
          .pipe(take(1))
          .pipe(catchError((e) => {
            this.isServerError = true;
            return e;
          }))
          .subscribe((countEmployeeNo:any) => {
            if(countEmployeeNo.length === 0 || countEmployeeNo === undefined){
              this.driverService.createDriver(this.driver)
              .pipe(take(1))
              .pipe(catchError((e) => {
                this.isServerError = true;
                return e;
              }))
              .subscribe(() => {
                // move to edit mode
                window.location.href = '/drivers/new';
              })
            } else {
              alert('Employee Number ' + this.driver.employeeNumber + ' already exists.')
            }
          })
        } else {
          alert(this.driver.firstName + ' ' + this.driver.lastName + ' is already on the System')
        }
      })
    } else {
      this.isError = true;
    }
  }

}
