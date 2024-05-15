import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import * as moment from 'moment';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { VehicleDetailService } from 'src/app/workshop/services/vehicledetails.service';
import { VehicleDetails } from 'src/app/workshop/models/vehicledetails.model';

@Component({
  selector: 'app-vehicle-new',
  templateUrl: './vehicle-new.component.html',
  styleUrls: ['./vehicle-new.component.scss']
})
export class WorkshopVehicleNewComponent implements OnInit {
  vehicleDetails: VehicleDetails = new VehicleDetails();
  vehicleId:number = -1;

  constructor(
    private vehicleDetailService: VehicleDetailService,
    private vehicleService: VehicleService,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if(params['id'] !== undefined){
        this.vehicleId = params['id'];
        if(this.vehicleId !== -1){
          this.vehicleService.getVehicleById(params['id']).subscribe(data => {
            // delete this.vehicleDetails.vehicle;
            // this.vehicleDetails.vehicle = data;
          })
        }
      }
    })
  }

  saveVehicle(){
    if(this.vehicleId === -1){
      // const vehicle = this.vehicleDetails.vehicle;
      const details = this.vehicleDetails;

      // delete vehicle.id;

      // if(this.validateVehicle(vehicle)){
      //   this.vehicleService.createVehicle(vehicle)
      //   .pipe(catchError((e) => {
      //     alert('Could not Save Vehicle');
      //     return e;
      //   }))
      //   .pipe(take(1))
      //   .subscribe((vehicleData:any) => {
      //     details.vehicleId = parseInt(vehicleData.id,10);
      //     vehicle.id = parseInt(vehicleData.id,10);
      //     this.vehicleDetailService.createVehicle(this.vehicleDetails)
      //     .pipe(catchError((e) => {
      //       alert('Could not Save Vehicle Details');
      //       return e;
      //     }))
      //     .pipe(take(1))
      //     .subscribe((detailData: any) => {
      //       vehicle.detailId = detailData.id;
      //       this.vehicleService.updateVehicle(vehicle)
      //       .pipe(catchError((e) => {
      //         alert('Could not Save Vehicle');
      //         return e;
      //       }))
      //       .pipe(take(1))
      //       .subscribe(() => {
      //         this.router.navigateByUrl('/4workshop/vehicle/' + vehicle.detailId)
      //       });
      //     });
      //   });
      // } else {
      //   alert('Please Fill in all details')
      // }

    } else {
      // const vehicle = this.vehicleDetails.vehicle;
      const details = this.vehicleDetails;
      // this.vehicleDetails.vehicleId = this.vehicleId;


      // if(this.validateVehicle(vehicle)){
      //   this.vehicleDetailService.createVehicle(details)
      //   .pipe(catchError((e) => {
      //     alert('Could not Save Vehicle Details');
      //     return e;
      //   }))
      //   .pipe(take(1))
      //   .subscribe((detailData: any) => {
      //     vehicle.detailId = parseInt(detailData.id,10);
      //
      //     this.vehicleService.updateVehicle(vehicle)
      //     .pipe(catchError((e) => {
      //       alert('Could not Save Vehicle');
      //       return e;
      //     }))
      //     .pipe(take(1))
      //     .subscribe(() => {
      //       this.router.navigateByUrl('/4workshop/vehicle/' + vehicle.detailId)
      //     });
      //   });
      // } else {
      //   alert('Please Fill in all details')
      // }

    }




  }

  cancelVehicle(){
    if(confirm('Exit without saving?')){
      this.router.navigateByUrl('4workshop/vehicles')
    }
  }

  validateVehicle(vehicle){
    let result = true;

    if(vehicle.registration === '' || vehicle.registration === ' ' || vehicle.registration.length < 1){
      result = false;
    }
    if(vehicle.vinNumber === '' || vehicle.vinNumber === ' ' || vehicle.vinNumber.length < 1){
      result = false;
    }

    if(vehicle.vehicleTypeId === -1){result = false;}
    if(vehicle.fuelTypeId === -1){result = false;}
    // if(vehicle.tareWeight <= 0){result = false;}

    return result;
  }

}
