import { Component, OnInit } from '@angular/core';
import { Fuel } from '../../models/fuel.model';
import { FuelValidatorService } from '../../validators/fuel-validator.service';
import { FuelService } from '../../services/fuel.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-fuel-new',
  templateUrl: './fuel-new.component.html',
  styleUrls: ['./fuel-new.component.scss']
})
export class FuelNewComponent implements OnInit {


  fuel: Fuel = new Fuel();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private fuelValidator: FuelValidatorService,
    private fuelService: FuelService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fuelValidator.isValid(this.fuel)) {
      // try to save it
      this.fuelService.createFuel(this.fuel)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/fuel/advanced';
      })
    } else {
      this.isError = true;
    }
  }


}
