import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { JobService } from 'src/app/timeline-skip/services/job.service';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/account/services/account.service';
import { take, catchError } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import { OrderService } from 'src/app/order/services/order.service';
import { InvoiceService } from 'src/app/invoice/services/invoice.service';
import { ReportingService } from '../../services/reporting.service';


@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  showAllReports:boolean = true;
  isLoading:boolean = false;

  dateStart = moment().subtract(1,'w').format('YYYY-MM-DD');
  dateEnd = moment().format('YYYY-MM-DD');
  tempStart = moment().subtract(1,'w').format('YYYY-MM-DD');
  tempEnd = moment().format('YYYY-MM-DD');
  section = '';
  sepaCodes:any = [];

  reportData = {
    header: '',
    entity: '',
    columnCount: 0,
    columns: [],
    data: []
  };

  reports = [
    {name:'Asset Utilisation',link:'assetUtilisation-report',disabled:false},
    {name:'Net Income By Vehicle',link:'netIncomeByVehicle-report',disabled:false},
    {name:'Debtors Report',link:'getDebtorsReport-report',disabled:false},
    {name:'Waste Return Removed',link:'wasteReturnReceived-report',disabled:false},
    {name:'Waste Return Received',link:'wasteReturnRemoved-report',disabled:false},
    {name:'Waste Recovered & Recycled From Site',link:'swpWasteChart-report',disabled:true},
  ]

  constructor(
    private jobService:JobService,
    private accountService: AccountService,
    private vehicleService: VehicleService,
    private jobAssignmentService:JobAssignmentService,
    private orderService: OrderService,
    private invoiceService: InvoiceService,
    private reportingService: ReportingService,
    private domSan: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.accountService.getSepaCodes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Sepa Codes could not be loaded");
      return e;
    }))
    .subscribe(sepaCodes => {
      this.sepaCodes = sepaCodes;
    });
  }

  changeDates(){
    this.dateStart = moment(this.tempStart).format('YYYY-MM-DD');
    this.dateEnd = moment(this.tempEnd).format('YYYY-MM-DD');

    this.loadReport(this.section);
  }

  loadReport(report:string){
    this.showAllReports = false;
    this.section = report;

    this.reportData = {
      header: '',
      entity: report,
      columnCount: 0,
      columns: [],
      data: []
    };

    switch(report){
      case 'all':
        this.showAllReports = true;
        break;
      case 'wasteReturnRemoved-report':
        this.reportData.header = 'Waste Return Removed (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 8;
        this.reportData.columns = ['Date','EWC Code','Grade','Weight ('+ environment.defaults.tareWeightUnit +')','Destination','Name of Destination Facility','Address of Destination Facility','License'];

        this.isLoading = true;

        // Need to group by Depot, then All grades to individual destinations

        this.jobService.getJobsByDateRangeAndDirection(this.dateStart,this.dateEnd,0)
          .pipe(take(1))
          .pipe(catchError((e) => {
            if(e.status === 403 || e.status === 401) {
              return e;
            }
            alert('Could not load data')
            return e;
          }))
          .subscribe((data:any) =>{

            const filteredData = data.filter(f=>f.weight > 0);

            filteredData.forEach(item => {
              if(item.order.grade === undefined || item.order.grade === null){
                item.order.grade = {id:null,name:'-',ewcCodes: '-',createdAt:'',updatedAt:''}
              }

              let address = '';
              if(item.order.site.billingAddress1 !== null && item.order.site.billingAddress1 !== undefined && item.order.site.billingAddress1 !== '' && item.order.site.billingAddress1 !== ' '){
                address += item.order.site.billingAddress1;
              }
              if(item.order.site.billingAddress2 !== null && item.order.site.billingAddress2 !== undefined && item.order.site.billingAddress2 !== '' && item.order.site.billingAddress2 !== ' '){
                address += ', ' + item.order.site.billingAddress2;
              }
              if(item.order.site.billingCity !== null && item.order.site.billingCity !== undefined && item.order.site.billingCity !== '' && item.order.site.billingCity !== ' '){
                address += ', ' + item.order.site.billingCity;
              }
              if(item.order.site.billingCountry !== null && item.order.site.billingCountry !== undefined && item.order.site.billingCountry !== '' && item.order.site.billingCountry !== ' '){
                address += ', ' + item.order.site.billingCountry;
              }
              if(item.order.site.billingPostCode !== null && item.order.site.billingPostCode !== undefined && item.order.site.billingPostCode !== '' && item.order.site.billingPostCode !== ' '){
                address += ', ' + item.order.site.billingPostCode;
              }

              this.accountService.getAllDepotDetails(item.order.site.id).subscribe(depotDetail => {
                const sepa = this.sepaCodes.filter(f=>f.id === item.order.site.sepaId)[0];
                let sepaDetails = '';
                let weight = '';
                let licenceNumber = '';

                if(sepa  === undefined){sepaDetails = 'Not Set';} else {sepaDetails = '(' + sepa.code + ') ' + sepa.name;}

                if(depotDetail === undefined || depotDetail[0] === undefined){
                  licenceNumber = 'n/a';
                } else {
                  licenceNumber = depotDetail[0].licenceNumber;
                }
                if(item.weight <= 0){
                  weight = 'Not Set';
                } else {
                  weight = (item.weight - item.tareWeight).toString();
                }

                let tempRow = {row:[
                  moment(item.date).format('DD/MM/YYYY'),
                  item.order.grade.ewcCodes,
                  item.order.grade.name,
                  weight,
                  sepaDetails,
                  item.order.site.name,
                  address,
                  licenceNumber
                ]};
                this.reportData.data.push(tempRow)
              });

              this.isLoading = false;
            })
          })
        break;
      case 'wasteReturnReceived-report':
        this.reportData.header = 'Waste Return Received (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 5;
        this.reportData.columns = ['Date','EWC Code','Grade','Weight ('+ environment.defaults.tareWeightUnit +')','Origin'];

        this.isLoading = true;

        this.jobService.getJobsByDateRangeAndDirection(this.dateStart,this.dateEnd,1)
          .pipe(take(1))
          .pipe(catchError((e) => {
            if(e.status === 403 || e.status === 401) {
              return e;
            }
            alert('Could not load data')
            return e;
          }))
          .subscribe((data:any) =>{

            const filteredData = data.filter(f=>f.weight > 0);

            filteredData.forEach(item => {
              if(item.order.grade === undefined || item.order.grade === null){
                item.order.grade = {id:null,name:'-',ewcCodes: '-',createdAt:'',updatedAt:''}
              }

              this.accountService.getAllDepotDetails(item.order.site.id).subscribe(depotDetail => {
                const sepa = this.sepaCodes.filter(f=>f.id === item.order.site.sepaId)[0];
                let sepaDetails = '';
                let weight = '';
                if(sepa  === undefined){sepaDetails = 'Not Set';} else {sepaDetails = '(' + sepa.code + ') ' + sepa.name;}

                if(item.weight <= 0){
                  weight = 'Not Set';
                } else {
                  weight = (item.weight - item.tareWeight).toString();
                }

                let tempRow = {row:[
                  moment(item.date).format('DD/MM/YYYY'),
                  item.order.grade.ewcCodes,
                  item.order.grade.name,
                  weight,
                  sepaDetails
                ]};
                this.reportData.data.push(tempRow)
              });

              this.isLoading = false;
            })
          })

        break;
      case 'assetUtilisation-report':
        this.reportData.header = 'Asset Utilisation (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 9;
        this.reportData.columns = ['Type','No Work','No Work %','Working','Working %','Available', 'Available %','Maintenance','Maintenance %',];

        this.isLoading = true;

        this.reportingService.getAssetUtilisation(this.dateStart,this.dateEnd)
        .pipe(catchError((e)=>{alert('Could not get asset utilisation');return e;}))
        .pipe(take(1))
        .subscribe((data:any) => {

          data.forEach(row => {
            const noWorkPercent = parseInt(row.No_Work_percent,10).toFixed(2) + '%';

            let tempRow = {row:[
              row.vehicleType,
              row.No_Work,
              noWorkPercent,
              row.Working,
              parseInt(row.Working_percent,10).toFixed(2)+'%',
              row.available,
              parseInt(row.available_percent,10).toFixed(2)+'%',
              row.maintenance,
              parseInt(row.maintenance_percent,10).toFixed(2)+'%'
            ]};

            this.reportData.data.push(tempRow)
          });
          this.isLoading = false;
        })

        break;
      case 'netIncomeByVehicle-report':
        this.reportData.header = 'Net income By Vehicle (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 9;
        this.reportData.columns = ['Registration','Gross Income','Cost of Sale','Net Income','Fuel Cost','Fuel %','Wages','Net Income','£ Average'];

        this.isLoading = true;

        this.reportingService.getNetIncomeByVehicle(this.dateStart,this.dateEnd)
        .pipe(catchError((e)=>{alert('Could not get Net Income By Vehicle Data');return e;}))
        .pipe(take(1))
        .subscribe((data:any) => {

          data.forEach(row => {

            if(row.registration === null){
              row.registration = 'Subcontractor'
            };

            if(row.Gross_Income === null || row.Gross_Income === ''){row.Gross_Income = 'n/a'} else {row.Gross_Income = '£' + row.Gross_Income};
            if(row.CoS === null){row.CoS = 'n/a'} else {row.CoS = '£' + row.CoS};
            if(row.Net_Income === null){row.Net_Income='n/a'} else {row.Net_Income = '£' + row.Net_Income};
            if(row.Fuel_Cost === null){row.Fuel_Cost='n/a'} else {row.Fuel_Cost= '£' + row.Fuel_Cost};
            if(row.Fuel_Percent === null){row.Fuel_Percent='n/a'} else {row.Fuel_Percent= row.Fuel_Percent + '%'};
            if(row.Wages === null){row.Wages='n/a'} else {row.Wages= '£' + row.Wages};
            if(row.Net_Income === null){row.Net_Income='n/a'} else {row.Net_Income= '£' + row.Net_Income};
            if(row.Pounds_Avg === null){row.Pounds_Avg='n/a'} else {row.Pounds_Avg= '£' + row.Pounds_Avg};

            let tempRow = {row:[
              row.registration,
              row.Gross_Income,
              row.CoS,
              row.Net_Income,
              row.Fuel_Cost,
              row.Fuel_Percent,
              row.Wages,
              row.Net_Income,
              row.Pounds_Avg
            ]}
            this.reportData.data.push(tempRow);
          })
          this.isLoading = false;
        })

        break;
      case 'getDebtorsReport-report':
        this.reportData.header = 'Debtors Report (Within 10% of Limit and On Stop)';
        this.reportData.columnCount = 5;
        this.reportData.columns = ['Account','On Stop','Credit Used','Credit Limit','Credit % Used'];

        this.isLoading = true;

        this.reportingService.getDebtorsReport(this.dateStart,this.dateEnd)
        .pipe(catchError((e)=>{alert('Could not get Net Income By Vehicle Data');return e;}))
        .pipe(take(1))
        .subscribe((data:any) => {

          data.forEach(row => {
            if(row.onStop === 1){row.onStop = 'On Stop'} else {row.onStop = 'Active'};
            if(row.usedCredit === null){row.usedCredit = 'n/a'} else {row.usedCredit = '£' + row.usedCredit}
            if(row.maxCredit === null){row.maxCredit = 'n/a'} else {row.maxCredit = '£' + row.maxCredit}
            if(row.percent === null){row.percent = 'n/a'} else {row.percent = row.percent + '%'}

            let tempRow = {row:[
              row.name,
              row.onStop,
              row.usedCredit,
              row.maxCredit,
              row.percent
            ]}
            this.reportData.data.push(tempRow);
          });
          this.isLoading = false;
        });

        break;
      case 'netByVehicle-report':
        this.reportData.header = 'Net Income by Vehicle (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 1;
        this.reportData.columns = ['Date'];

        this.isLoading = true;

        break;
      case 'mrfInOut-report':
        this.reportData.header = 'MRF IN vs OUT - incl. Internal Loads (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 1;
        this.reportData.columns = ['Date'];

        this.isLoading = true;

        break;
      case 'revenueByVehicle-report':
        this.reportData.header = 'Revenue By Vehicle - Driver Sheets (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 17;
        this.reportData.columns = ['Date','Registration','Driver','Quantity','Missed Lifts','Revenue','Total Bin Weights ('+ environment.defaults.tareWeightUnit +')','Tip Total','Total Tip Weights','Hours Worked','Break','Single Rate','Driver Pay','Miles','MPG','Fuel Cost','Vehicle Type'];

        this.isLoading = true;

        break;
      case 'customerServiceOverview-report':
        this.reportData.header = 'Customer Services Overview (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 11;
        this.reportData.columns = ['Job Date','Customer','Site','Weight ('+ environment.defaults.tareWeightUnit +')','Grade','Our Ref.','PO','Registration','Container','Qty','Invoice Line'];

        this.isLoading = true;

        this.jobService.getJobsByDateRange(this.dateStart,this.dateEnd)
          .pipe(take(1))
          .pipe(catchError((e) => {
            if(e.status === 403 || e.status === 401) {
              return e;
            }
            alert('Could not load data')
            return e;
          }))
          .subscribe((data:any) =>{
            const filteredData = data.filter(f=>f.weight > 0);

            filteredData.forEach(item => {
              let registration = '';
              this.jobAssignmentService.getJobAssignmentById(item.jobAssignmentId).subscribe(jobAss => {
                this.vehicleService.getVehicleById(jobAss.vehicleId).subscribe(vehicle => {
                  registration = vehicle.registration;

                  this.invoiceService.getAllInvoiceItemsByJobId(item.id).subscribe((invoiceItems:any) => {
                    let total = 0;
                    invoiceItems.forEach(item => {
                      total = item.price * item.qty;
                    })

                    if(total > 0){
                      let tempRow = {row:[
                        moment(item.date).format('DD/MM/YYYY'),
                        item.order.account.name,
                        item.order.site.name,
                        item.weight,
                        item.order.grade.name,
                        item.id,
                        item.order.poNumber,
                        registration, // Registration
                        item.order.containerType.name, // container
                        item.qty,
                        '£' +  total // tippingPriceId * qty
                        // invoicePrice * invoiceQty if not invoiced = 0
                      ]};
                      this.reportData.data.push(tempRow)
                    }
                  })
                })
              })
            })
          })
          this.isLoading = false;
        break;
      case 'purchaseInvoiceCheck-report':
        this.reportData.header = 'Purchase Invoice Check (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 1;
        this.reportData.columns = ['Date'];

        this.isLoading = true;

        this.isLoading = false;
        break;
      case 'skipSalesStats-report':
        this.reportData.header = 'Skip Transactions & Stats (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 24;
        this.reportData.columns = ['Order Id','Date','Name','Add. Name','Address','Postcode','Location','Service','Container','Grade','Weight ('+ environment.defaults.tareWeightUnit +')','Cust. £','Tip','Tip £','Additional Parties','Additional','Profit £','Profit %','Status','Updated On','Customer Wt','Tip Wt Source','N/U Cust.','N/U Tip'];

        this.isLoading = true;

        this.reportData.data = [
          {
            section: 'Account Skip Orders',
            sectionData: []
          },
          {
            section: 'Waste Skip Orders',
            sectionData: []
          }
        ];

        this.orderService.getSkipOrdersByDate(this.dateStart,this.dateEnd)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not load data')
          return e;
        }))
        .subscribe((data:any) =>{
          data.forEach(item => {
            // if(order.account.type_id === 16)

            const sepa = this.sepaCodes.filter(f=>f.id === item.order.site.sepaId)[0];
            let sepaDetails = '';
            let weight = '';

            if(item.weight <= 0){
              weight = 'Not Set';
            } else {
              weight = item.weight.toString();
            }

            if(sepa  === undefined){sepaDetails = 'Not Set';} else {sepaDetails = '(' + sepa.code + ') ' + sepa.name;}

            let address = '';
            if(item.order.site.billingAddress1 !== null && item.order.site.billingAddress1 !== undefined && item.order.site.billingAddress1 !== '' && item.order.site.billingAddress1 !== ' '){
              address += item.order.site.billingAddress1;
            }
            if(item.order.site.billingAddress2 !== null && item.order.site.billingAddress2 !== undefined && item.order.site.billingAddress2 !== '' && item.order.site.billingAddress2 !== ' '){
              address += ', ' + item.order.site.billingAddress2;
            }
            if(item.order.site.billingCity !== null && item.order.site.billingCity !== undefined && item.order.site.billingCity !== '' && item.order.site.billingCity !== ' '){
              address += ', ' + item.order.site.billingCity;
            }
            if(item.order.site.billingCountry !== null && item.order.site.billingCountry !== undefined && item.order.site.billingCountry !== '' && item.order.site.billingCountry !== ' '){
              address += ', ' + item.order.site.billingCountry;
            }

            let tempRow = {row:[
              'Order Id',
              moment(item.date).format('DD/MM/YYYY'), //'Date',
              item.order.account.name, //'Name',
              item.order.site.name, //'Add. Name',
              address, //'Address',
              item.order.site.billingPostCode, //'Postcode',
              sepa, //'Location',
              'Service',
              item.order.containerType.name, // container
              item.order.grade.name, //'Grade',
              item.weight, //'Weight
              'Cust. £',
              'Tip',
              'Tip £',
              'Additional Parties',
              'Additional',
              'Profit £',
              'Profit %',
              'Status',
              'Updated On',
              'Customer Wt',
              'Tip Wt Source',
              'N/U Cust.',
              'N/U Tip'
            ]};


            this.reportData.data[0].sectionData.push(tempRow)
          })
        });

        this.isLoading = false;

        break;
      case 'swpWasteChart-report':
        this.reportData.header = 'Waste Recovered & Recylced from Site Overview (' + moment(this.dateStart).format('DD/MM/YY') + ' - ' + moment(this.dateEnd).format('DD/MM/YY') + ')';
        this.reportData.columnCount = 9;
        this.reportData.columns = ['Date','Our Ref.','Weight Ticket','PO','Service','Container','Grade','EWC Code','Weight ('+ environment.defaults.tareWeightUnit +')'];

        this.isLoading = true;

        break;
    }
  }

  getColumnValueForField(column: any, record: any, raw: boolean = false): any {
    let value: any = null;
    if(column !== null && column !== undefined && column !== '') {
      value = record;
    } else {
      if(column.indexOf('.') === -1) {
        value = record;
      } else {
        const fieldParts = column.split('.');

        let buildUpValue = record;

        for(let i = 0; i < fieldParts.length; i++) {
          buildUpValue = buildUpValue[fieldParts[i]];
        }

        value = buildUpValue;

      }
    }
    if(!raw) {
      return this.domSan.bypassSecurityTrustHtml(value);
    } else {
      return value;
    }
  }

  exportToCSV() {
    let data = '';

    this.reportData.columns.forEach((column) => {
      data += column + ',';
    })

    data = data.substring(0, data.length - 1) + "\n";

    this.reportData.data.forEach(record => {

      record.row.forEach(item =>{
        data += '"' + String(item).replace(/(<([^>]+)>)/gi, "") + '",';

      })
      // data += '"' + String(this.getColumnValueForField(column, record, true)).replace(/(<([^>]+)>)/gi, "") + '",';

      data = data.substring(0, data.length - 1) + "\n";
    });


    var link = document.createElement("a");
    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    link.setAttribute("download", this.reportData.entity + ".csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv"


  }

  handleNull(input){
    if(input === null){
      return 'n/a';
    } else {
      return input;
    }
  }

}
