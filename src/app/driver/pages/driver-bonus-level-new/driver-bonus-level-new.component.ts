import { Component, OnInit } from '@angular/core';
import { DriverBonusLevel } from '../../models/driver-bonus-level.model';
import { DriverBonusLevelValidatorService } from '../../validators/driver-bonus-level-validator.service';
import { DriverBonusLevelService } from '../../services/driver-bonus-level.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-driver-bonus-level-new',
  templateUrl: './driver-bonus-level-new.component.html',
  styleUrls: ['./driver-bonus-level-new.component.scss']
})
export class DriverBonusLevelNewComponent implements OnInit {

  bonusLevel: DriverBonusLevel = new DriverBonusLevel();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private driverBonusLevelValidatorService: DriverBonusLevelValidatorService,
    private driverBonusLevelService: DriverBonusLevelService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.driverBonusLevelValidatorService.isValid(this.bonusLevel)) {
      // try to save it
      this.driverBonusLevelService.createDriverBonusLevel(this.bonusLevel)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/drivers/bonus';
      })
    } else {
      this.isError = true;
    }
  }


}
