import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take, catchError } from 'rxjs/operators';
import { ArticSheetService } from 'src/app/artic-timeline/services/artic-sheet.service';
import { OrderProvision } from '../../models/order-provision.model';
import { Order } from '../../models/order.model';
import { OrderProvisionService } from '../../services/order-provision.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-csv-to-json',
  templateUrl: './order-csv-to-json.component.html',
  styleUrls: ['./order-csv-to-json.component.scss']
})
export class OrderCsvToJsonComponent implements OnInit {

  date:string = '';
  file: any = '';
  data: any = '';
  parsed: boolean = false;
  output: any = {};
  tableData: any[] = [];

  parentJobIds:number[] = [];
  constructor(private articSheetService: ArticSheetService,
    private orderService: OrderService,
    private router: Router,
    private orderProvisionService: OrderProvisionService) { }

  ngOnInit(): void {
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  uploadDocument() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      this.data = fileReader.result as any;

        this.articSheetService.parseSheet(this.data)
        .subscribe((data) => {
          this.output = data['data'];
          this.parsed = true;
          this.setupData();
        })

    }
    fileReader.readAsText(this.file);
}

  run() {
    this.uploadDocument();
  }


  setupData() {
    this.output.forEach((element) => {
          this.articSheetService.findOrderIdFromProductName(element)
          .pipe(take(1))
          .pipe(catchError((e) => {
            if(e.status === 403 || e.status === 401) {
              return e;
            }
            return e;
          }))
          .subscribe((data: any) => {
            element['orderid'] = data[0].id;
            this.save(element);
          });
    });
    alert('Data Saved Successfully');
  }


  save(element: any) {
    // let provisions: OrderProvision[] = [];

    
    
    var object = {};
    object['Time'] = element['Collection Time'];
    object['Date'] = element['Date'];
    object['DepotRef'] = element['Depot Ref'];
    object['Haulier'] = element['Haulier'];
    object['LoadId'] = element['Load ID'];
    object['Product'] = element['Product'];
    object['Ref'] = element['Ref'];
    object['orderid'] = element['orderid'];

    this.articSheetService.SaveOrderProvision(object).pipe(catchError((e) => {
      
      alert('Could not save');
      return e;
    })).subscribe((data) => {
      
    });


   
  }


}
