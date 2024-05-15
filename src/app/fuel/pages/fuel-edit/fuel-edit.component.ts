import { Component, OnInit } from '@angular/core';
import { Fuel } from '../../models/fuel.model';
import { ActivatedRoute } from '@angular/router';
import { FuelValidatorService } from '../../validators/fuel-validator.service';
import { FuelService } from '../../services/fuel.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-fuel-edit',
  templateUrl: './fuel-edit.component.html',
  styleUrls: ['./fuel-edit.component.scss']
})
export class FuelEditComponent implements OnInit {
  fuel: Fuel = new Fuel();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private fuelValidatorService: FuelValidatorService,
    private fuelService: FuelService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadFuel(+params['id']);
    })
  }

  loadFuel(id: number): void {
    this.fuelService.getFuelById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((fuel: Fuel) => {
      this.fuel = fuel;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fuelValidatorService.isValid(this.fuel)) {
      // try to save it
      this.fuelService.updateFuel(this.fuel)
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
