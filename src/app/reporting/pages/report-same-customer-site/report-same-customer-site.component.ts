import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { OrderService } from 'src/app/order/services/order.service';

@Component({
  selector: 'app-report-same-customer-site',
  templateUrl: './report-same-customer-site.component.html',
  styleUrls: ['./report-same-customer-site.component.scss']
})
export class ReportSameCustomerSiteComponent implements OnInit {

  data:any = {};
  searchFilters: any = {};

  constructor(private accountService: AccountService,
    private orderService: OrderService) { }

  ngOnInit(): void {
  }

  loadReport() {
    this.orderService.getSameCustomerAndSite()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load report');
      return e;
    }))
    .subscribe((data) => {
      this.data = data;
    })
  }

  exportToCSV() {
    let data = 'Order ID,Order Date,Account Name,Site Name,Status';

    data = data.substring(0, data.length - 1) + "\n";

    this.data.forEach(record => {
      data += `${record.OrderId},${record.OrderDate},"${record.AccountName}","${record.SiteName}",${record.Status}\n`;
    });


    var link = document.createElement("a");
    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    link.setAttribute("download", "SameCustomerAndSite.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv"


  }

}
