import { Component, OnInit } from '@angular/core';
import { VehicleVOR } from '../../models/vehicle-vor.model';
import { ActivatedRoute } from '@angular/router';
import { VehicleVORValidatorService } from '../../validators/vehicle-vor-validator.service';
import { VehicleVorService } from '../../services/vehicle-vor.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles-vor-edit',
  templateUrl: './vehicles-vor-edit.component.html',
  styleUrls: ['./vehicles-vor-edit.component.scss']
})
export class VehiclesVorEditComponent implements OnInit {


  vehicleVOR: VehicleVOR = new VehicleVOR();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private vehicleVORValidator: VehicleVORValidatorService,
    private vehicleVORService: VehicleVorService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadVehicleVOR(+params['id']);
    })
  }

  loadVehicleVOR(id: number): void {
    this.vehicleVORService.getVehicleVORById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      this.isServerError = true;
      return e;
    }))
    .subscribe((vehicleVOR: VehicleVOR) => {
      this.vehicleVOR = vehicleVOR;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.vehicleVORValidator.isValid(this.vehicleVOR)) {
      // try to save it
      this.vehicleVORService.updateVehicleVOR(this.vehicleVOR)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
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
