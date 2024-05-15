import { Component, OnInit } from '@angular/core';
import { FuelPrice } from '../../models/fuel-price.model';
import { ActivatedRoute } from '@angular/router';
import { FuelPriceValidatorService } from '../../validators/fuel-price-validator.service';
import { FuelPriceService } from '../../services/fuel-price.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-fuel-prices-edit',
  templateUrl: './fuel-prices-edit.component.html',
  styleUrls: ['./fuel-prices-edit.component.scss']
})
export class FuelPricesEditComponent implements OnInit {


  fuelPrice: FuelPrice = new FuelPrice();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private fuelPriceValidator: FuelPriceValidatorService,
    private fuelPriceService: FuelPriceService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadFuelPrice(+params['id']);
    })
  }

  loadFuelPrice(id: number): void {
    this.fuelPriceService.getFuelPriceById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((fuelPrice: FuelPrice) => {
      this.fuelPrice = fuelPrice;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.fuelPriceValidator.isValid(this.fuelPrice)) {
      // try to save it
      this.fuelPriceService.updateFuelPrice(this.fuelPrice)
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
