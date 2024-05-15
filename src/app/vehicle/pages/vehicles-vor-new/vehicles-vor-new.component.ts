import { Component, OnInit } from '@angular/core';
import { VehicleVOR } from '../../models/vehicle-vor.model';
import { VehicleVORValidatorService } from '../../validators/vehicle-vor-validator.service';
import { VehicleVorService } from '../../services/vehicle-vor.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles-vor-new',
  templateUrl: './vehicles-vor-new.component.html',
  styleUrls: ['./vehicles-vor-new.component.scss']
})
export class VehiclesVorNewComponent implements OnInit {

  vehicleVOR: VehicleVOR = new VehicleVOR();

  isError: boolean = false;
  isServerError: boolean = false;

  constructor(private vehicleVORValidator: VehicleVORValidatorService,
    private vehicleVORService: VehicleVorService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.vehicleVORValidator.isValid(this.vehicleVOR)) {
      // try to save it
      this.vehicleVORService.createVehicleVOR(this.vehicleVOR)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        window.location.href = '/vehicles/vor';
      })
    } else {
      this.isError = true;
    }
  }

}
