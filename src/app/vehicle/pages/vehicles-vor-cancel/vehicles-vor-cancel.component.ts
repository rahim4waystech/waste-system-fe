import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VehicleVorService } from '../../services/vehicle-vor.service';
import { VehicleVOR } from '../../models/vehicle-vor.model';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-vehicles-vor-cancel',
  templateUrl: './vehicles-vor-cancel.component.html',
  styleUrls: ['./vehicles-vor-cancel.component.scss']
})
export class VehiclesVorCancelComponent implements OnInit {

  constructor(private vehicleVORService: VehicleVorService,
    private router: Router,
    private route: ActivatedRoute) { }

  id: number = -1;

  vehicleVOR: VehicleVOR = new VehicleVOR();

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.loadVehicleVOR(this.id);
    })
  }

  loadVehicleVOR(id:number): void {
    this.vehicleVORService.getVehicleVORById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Vehicle vor could not be loaded. Please try again later');
      return e;
    }))
    .subscribe((data: VehicleVOR) => {
      this.vehicleVOR = data;
    })
  }
  onCancelClicked() {
    this.vehicleVOR.deleted = true;

    this.vehicleVORService.updateVehicleVOR(this.vehicleVOR)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Vehicle VOR could not be cancelled. Please try again later.')
      return e;
    }))
    .subscribe((data) => {
      this.router.navigateByUrl('/vehicles/vor');
    })
  }

}
