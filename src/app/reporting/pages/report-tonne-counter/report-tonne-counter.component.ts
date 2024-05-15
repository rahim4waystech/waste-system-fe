import { Component, OnInit } from '@angular/core';
import { take, catchError } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Account } from 'src/app/order/models/account.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';

@Component({
  selector: 'app-report-tonne-counter',
  templateUrl: './report-tonne-counter.component.html',
  styleUrls: ['./report-tonne-counter.component.scss']
})
export class ReportTonneCounterComponent implements OnInit {

  searchFilters: any = {};

  selectedJobs: Job[] = [];
  jobs: Job[] = [];
  accounts: Account[] = [];
  tips: Account[] = [];
  sites: Account[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  constructor(private accountService: AccountService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private jobService: JobService) { }

  ngOnInit(): void {
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


    this.accountService.getAllSites()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load accounts');
      return e;
    }))
    .subscribe((accounts: any) => {
      this.sites = accounts;
    })

    this.accountService.getAllTips()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load accounts');
      return e;
    }))
    .subscribe((accounts: any) => {
      this.tips = accounts;
    })

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

  onSelectJob(job: Job) {
    if(this.selectedJobs.filter(j => j.id === job.id).length > 0) {
        this.selectedJobs = this.selectedJobs.filter(j => j.id !== job.id);
    } else {
      this.selectedJobs.push(job);
    }
  }

  getSelectedDetails() {

    let price = 0;
    let qty = 0;

    this.selectedJobs.forEach((job: Job) => {
      let itemPrice: number = job.order['orderLines'][0] ? job.order['orderLines'][0].price : 0;
      qty += job.qty;
      price += itemPrice * job.qty;
    });

    return {total: this.selectedJobs.length, qty: qty, price:price.toFixed(2)};
  }


  loadReport() {
    this.jobService.loadCountReport(this.searchFilters)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not get report');
      return e;
    }))
    .subscribe((jobs: Job[]) => {

      this.jobs = [];
      jobs.forEach((job: any) => {
        const orderlines = job.order.orderLines;


        // make sure it's a tonne job
        const hasLoad = orderlines.filter(ol => ol.unitId === 6).length > 0;

        if(hasLoad) {
          this.jobs.push(job);
        }
      })
    })
  }



  getTotalTonneCount() {
    return this.jobs.map(item => item.qty).reduce((prev, next) => prev + next).toFixed(2);
  }

  exportToCSV() {
    let data = 'Job ID,Order Ref,Customer,Site,Number of Loads,Date,Vehicle,Driver,';

    data = data.substring(0, data.length - 1) + "\n";

    this.jobs.forEach(record => {
      let driverFirst = record.jobAssignment.driver ? record.jobAssignment.driver.firstName : '';
      let driverLast = record.jobAssignment.driver ? record.jobAssignment.driver.lastName : '';
      let vehicle = record.jobAssignment.vehicle ? record.jobAssignment.vehicle.registration : 'N/A';

      data += `${record.id},${record.order.id},"${record.order.account.name}","${record.order.site.name}",${record.qty},${record.date},${driverFirst} ${driverLast},${vehicle}\n`;
    });


    var link = document.createElement("a");
    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    link.setAttribute("download", "tonnecount.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv"


  }

}
