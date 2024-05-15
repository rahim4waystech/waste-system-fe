import { Component, OnInit } from '@angular/core';
import { FuelPrice } from '../../models/fuel-price.model';
import { FuelPriceValidatorService } from '../../validators/fuel-price-validator.service';
import { FuelPriceService } from '../../services/fuel-price.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-fuel-prices-new',
  templateUrl: './fuel-prices-new.component.html',
  styleUrls: ['./fuel-prices-new.component.scss']
})
export class FuelPricesNewComponent implements OnInit {


  fuelPrice: FuelPrice = new FuelPrice();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private fuelPriceValidator: FuelPriceValidatorService,
    private fuelPriceService: FuelPriceService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fuelPriceValidator.isValid(this.fuelPrice)) {
      // try to save it
      this.fuelPriceService.createFuelPrice(this.fuelPrice)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/fuel/prices';
      })
    } else {
      this.isError = true;
    }
  }


}
