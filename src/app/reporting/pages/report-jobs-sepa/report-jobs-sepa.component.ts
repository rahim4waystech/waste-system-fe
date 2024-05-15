import { Component, OnInit } from "@angular/core";
import { take, catchError } from "rxjs/operators";
import { AccountService } from "src/app/account/services/account.service";
import { InvoiceService } from "src/app/invoice/services/invoice.service";
import { Account } from "src/app/order/models/account.model";
import { Job } from "src/app/timeline-skip/models/job.model";
import { JobService } from "src/app/timeline-skip/services/job.service";
import { environment } from "src/environments/environment";

  
  @Component({
    selector: 'app-report-jobs-sepa',
    templateUrl: './report-jobs-sepa.component.html',
    styleUrls: ['./report-jobs-sepa.component.scss']
  })
  export class ReportJobsSepaComponent implements OnInit {
  
    searchFilters: any = {};
  
    results: any[] = [];
    accounts: Account[] = [];
    constructor(private accountService: AccountService,
      private jobService: JobService,
      private invoiceService: InvoiceService) { }
  
    ngOnInit(): void {
      this.accountService.getAllAccounts()
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
    }
  
    loadReport() {
      this.jobService.getSepaJobs(this.searchFilters)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('could not get report');
        return e;
      }))
      .subscribe((results: any[]) => {
        this.results = results;
      })
    }
  
    exportToCSV() {
      let data = 'Invoice ID,Job Id,Driver,Vehicle,Subcontractor,Subcontractor Reg,';
  
      data = data.substring(0, data.length - 1) + "\n";
  
      this.results.forEach(record => {
        data += `${record.invoiceId},${record.jobId},"${record.driver}","${record.vehicle}",${record.subcontractor},${record.subcontractorReg}\n`;
      });

  
  
      var link = document.createElement("a");
      link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
      link.setAttribute("download", "sepa.csv");
      document.body.appendChild(link); // Required for FF
  
      link.click(); // This will download the data file named "my_data.csv"
  
  
    }

    downloadInvoices() {
      let invoiceIds = this.results.map(r => r.invoiceId);

      var unqiueIds = [];
      for (var i = 0; i < invoiceIds.length; i++) {
        if (unqiueIds.indexOf(invoiceIds[i]) === -1) {
        unqiueIds.push(invoiceIds[i]);
        }
      }
  
      const data =  {
        "invoiceIds": unqiueIds,
        "type": 1,
        "pods": false,
        "tipchecks": false,
      }
  
      this.invoiceService.createPDFBatchFile(data)
      .pipe(take(1))
      .pipe(catchError((e)=> {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not generate invoice please try again later.');
        return e;
      }))
      .subscribe((data:any) => {
        window.open(environment.publicUrl + data.fileName, '_blank');
      })
    } 
  
  }
