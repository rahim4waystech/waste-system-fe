import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { DriverService } from 'src/app/driver/services/driver.service';
import { VehicleVorService } from 'src/app/vehicle/services/vehicle-vor.service';
import { VehicleVOR } from 'src/app/vehicle/models/vehicle-vor.model';
import { take, catchError } from 'rxjs/operators';
import { SkipTimelineStateService } from '../../services/skip-timeline-state.service';
import { DriverAbsenceService } from 'src/app/driver/services/driver-absence.service';
import { DriverAbsence } from 'src/app/driver/models/driver-absence.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { environment } from 'src/environments/environment';

declare var $;


@Component({
  selector: 'app-timeline-skip',
  templateUrl: './timeline-skip.component.html',
  styleUrls: ['./timeline-skip.component.scss']
})
export class TimelineSkipComponent implements OnInit {
  orderTypeId = 1;
  date: string = moment().format('YYYY-MM-DD');

  absenceAndVors: any = {absence: [], vor: []}

  constructor(private vehicleVORService: VehicleVorService,
    private modalService: ModalService,
    private skipTimelineStateService: SkipTimelineStateService,
    private driverAbsenceService: DriverAbsenceService) { }

  ngOnInit(): void {

    this.loadVehicleVOR();

    this.skipTimelineStateService.$skipDateChanged.subscribe((date) => {
      this.date = moment(date).format('YYYY-MM-DD');

      this.loadVehicleVOR();
      this.loadDriverAbsence();
    })

    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  loadVehicleVOR() {
    this.vehicleVORService.getVehicleVORsByDateAndVehicleTypeId(moment().format('YYYY-MM-DD'),1)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("vehicle VOR could not be loaded");
      return e;
    }))
    .subscribe((data: VehicleVOR[]) => {
      this.absenceAndVors.vor = data;
      this.skipTimelineStateService.$skipVorAndAbsenceChanged.next(this.absenceAndVors);
    })
  }

  loadDriverAbsence() {
    this.driverAbsenceService.getAbsenceByDate(this.date)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("driver absence could not be loaded");
      return e;
    }))
    .subscribe((data: DriverAbsence[]) => {
      this.absenceAndVors.absence = data;
      this.skipTimelineStateService.$skipVorAndAbsenceChanged.next(this.absenceAndVors);
    })
  }

  openModal(name:string) {
    this.modalService.open(name);
  }

}
