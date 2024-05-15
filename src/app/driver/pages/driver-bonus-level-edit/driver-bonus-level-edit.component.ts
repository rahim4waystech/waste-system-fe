import { Component, OnInit } from '@angular/core';
import { DriverBonusLevel } from '../../models/driver-bonus-level.model';
import { ActivatedRoute } from '@angular/router';
import { DriverBonusLevelValidatorService } from '../../validators/driver-bonus-level-validator.service';
import { DriverBonusLevelService } from '../../services/driver-bonus-level.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-driver-bonus-level-edit',
  templateUrl: './driver-bonus-level-edit.component.html',
  styleUrls: ['./driver-bonus-level-edit.component.scss']
})
export class DriverBonusLevelEditComponent implements OnInit {

  driverBonusLevel: DriverBonusLevel = new DriverBonusLevel();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private driverBonusLevelValidatorService: DriverBonusLevelValidatorService,
    private driverBonusLevelService: DriverBonusLevelService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadDriverBonusLevel(+params['id']);
    })
  }

  loadDriverBonusLevel(id: number): void {
    this.driverBonusLevelService.getDriverBonusLevelById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((driverBonusLevel: DriverBonusLevel) => {
      this.driverBonusLevel = driverBonusLevel;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.driverBonusLevelValidatorService.isValid(this.driverBonusLevel)) {
      // try to save it
      this.driverBonusLevelService.updateDriver(this.driverBonusLevel)
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
