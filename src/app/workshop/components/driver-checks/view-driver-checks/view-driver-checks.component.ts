import { Component, OnInit } from '@angular/core';
import { VehicleCheckService } from 'src/app/workshop/services/vehiclechecks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-view-driver-checks',
  templateUrl: './view-driver-checks.component.html',
  styleUrls: ['./view-driver-checks.component.scss']
})
export class ViewDriverChecksComponent implements OnInit {
  checkGroup: number = -1;
  group: any = [];
  rows:any = [];
  inspectionEnd:string= '';

  constructor(
    private vehicleChecksService: VehicleCheckService,
    private router:Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.checkGroup = params['id'];

      this.vehicleChecksService.getDriverChecksGroupById(this.checkGroup)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Checks');return e;}))
      .pipe(take(1))
      .subscribe((group:any) => {
        this.group = group[0];
      })

      this.vehicleChecksService.getDriverChecksByGroupId(this.checkGroup)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Checks');return e;}))
      .pipe(take(1))
      .subscribe((checks:any) => {
        this.inspectionEnd = moment(checks[checks.length -1].createdAt).format('HH:mm:ss DD/MM/YYYY');
        checks.forEach(item => {
          item.createdAt = moment(item.createdAt).format('HH:mm:ss');
        })
        this.rows = checks;
      })
    })
  }

}
