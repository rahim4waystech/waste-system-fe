import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Account } from 'src/app/order/models/account.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';

@Component({
  selector: 'app-report-jobs',
  templateUrl: './report-jobs.component.html',
  styleUrls: ['./report-jobs.component.scss']
})
export class ReportJobsComponent implements OnInit {

  jobs: Job[] = [];

  accounts: Account[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  searchFilters: any = {};
  constructor(private jobService: JobService,
    private accountService: AccountService,
    private vehicleService: VehicleService,
    private driverService: DriverService) { }

  ngOnInit(): void {
    this.vehicleService.getAllVehicles()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load vehicles');
      return e;
    }))
    .subscribe((vehicles: any) => {
      this.vehicles = vehicles;
    })

    this.accountService.getAllAccountsForCustomerAndProspect()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load accounts');
      return e;
    }))
    .subscribe((accounts: any) => {
      this.accounts = accounts;
    })


    this.driverService.getAllDrivers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load drivers');
      return e;
    }))
    .subscribe((drivers: any) => {
      this.drivers = drivers;
    })
  }

  loadReport() {
    this.jobService.jobReport(this.searchFilters)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load report');
      return e;
    }))
    .subscribe((data) => {
      this.jobs = data;
    })
    
  }

  exportToCSV() {
    let data = 'Job ID,Parent job id,Customer,Site,Tip Site,Qty,Date,Vehicle,Driver,Subcontractor,';

    data = data.substring(0, data.length - 1) + "\n";

    this.jobs.forEach(record => {
      data += record.id + ',';
      data += record.order.id + ',';
      data += '"' + record.order.account.name + '",';
      data += '"' + record.order.site.name + '",';
      data += '"' + record.order.tipSite.name + '",';
      data += record.qty + ',';
      data += record.date + ',';
      data += !record.jobAssignment.vehicle ? 'N/A,' : record.jobAssignment.vehicle.registration + ',';
      data += record.jobAssignment.driver ? record.jobAssignment.driver.firstName + ' ' + record.jobAssignment.driver.lastName + ',' : 'N/A' + ',';
      data += !record.jobAssignment.subcontractor ? 'N/A,' : record.jobAssignment.subcontractor.name + ',';
      data += "\n";
    });


    var link = document.createElement("a");
    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    link.setAttribute("download", "jobs.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv"


  }

}
