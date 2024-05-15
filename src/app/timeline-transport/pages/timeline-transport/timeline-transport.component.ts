import { Component, OnInit } from '@angular/core';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { take, catchError } from 'rxjs/operators';
import { TimelineTransportStateService } from '../../services/timeline-transport-state.service';
import { VehicleVorService } from 'src/app/vehicle/services/vehicle-vor.service';
import { DriverAbsenceService } from 'src/app/driver/services/driver-absence.service';
import * as moment from 'moment';
import { pipe } from 'rxjs';
import { VehicleVOR } from 'src/app/vehicle/models/vehicle-vor.model';
import { DriverAbsence } from 'src/app/driver/models/driver-absence.model';
import { environment } from 'src/environments/environment';
import { UserSettingsService } from 'src/app/settings/services/user-settings.service';
import { Personalisation } from 'src/app/settings/models/personalisation.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';
@Component({
  selector: 'app-timeline-transport',
  templateUrl: './timeline-transport.component.html',
  styleUrls: ['./timeline-transport.component.scss']
})
export class TimelineTransportComponent implements OnInit {

  absenceAndVors: any = {vor: [], absence: []};
  date: string = moment().format('YYYY-MM-DD');
  orderTypeId: number = environment.defaults.defaultTimeline;
  timelineSettings:Personalisation = new Personalisation();
  user: User = new User();

  constructor(private jobAssignmentService: JobAssignmentService,
    private vehicleVORService: VehicleVorService,
    private driverAbsenceService: DriverAbsenceService,
    private userSettingsService: UserSettingsService,
    private authService:AuthService,
    private timelineTransportStateService: TimelineTransportStateService) { }

  ngOnInit(): void {
    this.timelineSettings.timelineOrientationShredder = false;
    this.user = this.authService.getUser();

    this.userSettingsService.getSettingsByUserId(this.user.id)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not get timeline settings');
      return e;
    }))
    .pipe(take(1))
    .subscribe((timelineSetting:any) => {
      if(timelineSetting.length !== 0){
        this.timelineSettings = timelineSetting[0];
      } else {
        this.timelineSettings = new Personalisation();

        this.timelineSettings.userId = this.user.id;
        this.userSettingsService.createPersonalisation(this.timelineSettings)
        .pipe(catchError((e)=>{
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not add Orientation settings');
          return e;
        }))
        .pipe(take(1))
        .subscribe((settings:Personalisation)=>{
          this.timelineSettings = settings;
        })
      }
    })

    this.loadDriverAbsence();
    this.loadVehicleVOR();

    const lcDate = localStorage.getItem('MJL_TRANSPORT_TIMELINE_DATE');
    
    if(lcDate && lcDate !== '') {
      this.date = lcDate;
    }

    this.timelineTransportStateService.$transportDateChanged.subscribe((date) => {
      this.date = moment(date).format('YYYY-MM-DD');
      this.loadVehicleVOR();
      this.loadDriverAbsence();
    })

    this.timelineTransportStateService.$transportOrderTypeChanged.subscribe((orderTypeId) => {
      this.orderTypeId = orderTypeId;
      debugger;
      this.loadVehicleVOR();
      this.loadDriverAbsence();
    })
  }



  loadVehicleVOR() {
    const vehicleMatch = environment.timelineOptions.filter(f=>f.value === this.orderTypeId)[0];
    this.vehicleVORService.getVehicleVORsByDateAndVehicleTypeId(moment(this.date).format('YYYY-MM-DD'),parseInt(vehicleMatch.match,10))
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
      this.timelineTransportStateService.$transportVorAndAbsenceChanged.next(this.absenceAndVors);
    })
  }

  loadDriverAbsence() {
    this.driverAbsenceService.getAbsenceByDate(moment(this.date).format('YYYY-MM-DD'))
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
      this.timelineTransportStateService.$transportVorAndAbsenceChanged.next(this.absenceAndVors);
    })
  }

}


