import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { InspectionDates } from 'src/app/workshop/models/inspection-dates.model';
import { DefectService } from 'src/app/workshop/services/defect.service';

@Component({
  selector: 'app-historic-inspections',
  templateUrl: './historic-inspections.component.html',
  styleUrls: ['./historic-inspections.component.scss']
})
export class HistoricInspectionsComponent implements OnInit {
  vehicleId:number = -1;
  vehicle: Vehicle = new Vehicle();
  inspections: InspectionDates[] = [];

  constructor(
    private route:ActivatedRoute,
    private defectService:DefectService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.vehicleId = +params['id'];

      this.defectService.getHistoricInspectionDatesByVehicleId(this.vehicleId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get inspections');return e;}))
      .pipe(take(1))
      .subscribe((inspections:any) => {
        this.inspections = inspections;
        this.vehicle = this.inspections[0].vehicle;
      })
    })
  }

  showDate(date){
    return moment(date,'YYYY-MM-DD').format('DD/MM/YYYY');
  }

  nextDate(date,interval,unit){
    return moment(date,'YYYY-MM-DD').add(interval,unit).format('DD/MM/YYYY');
  }

}
