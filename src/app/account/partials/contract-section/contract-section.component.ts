import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { ContractService } from 'src/app/contract/service/contract.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Account } from 'src/app/order/models/account.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contract-section',
  templateUrl: './contract-section.component.html',
  styleUrls: ['./contract-section.component.scss']
})
export class ContractSectionComponent implements OnInit, AfterViewInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  @Input()
  account:Account = new Account();

  contractButtons: GridButton[] = [
    {label: 'Edit', link: '/contracts/edit/:id', type: 'btn-warning',} as GridButton,
    {label: 'PDF', type: 'btn-info', action: (button, record) => {this.onPDFDownload(record);},} as GridButton,

  ]
  contractColumns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Status', field: 'contractStatus.name'} as GridColumn,
    {active: true, label: 'Type', field: 'contractType.name'} as GridColumn,
    {active: true, label: 'Risk', field: 'riskLevel'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  contractFilters: GridFilter[] = [{}as GridFilter]
  contractSearchFields: any = ['name'];

  contractSearchFilters: GridSearchFilter[] = [
    {
      field: 'name',
      label: 'Name',
    } as GridSearchFilter,
  ]

  constructor(
    private contractService: ContractService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){
    // Set sites account id
    if(changes.account) {
      if(changes.account.currentValue.id !== -1) {
        const contractFilters = [];
        contractFilters.push({
          condition: 'eq',
          value: this.account.id,
          field: 'accountId'
        } as GridFilter)

        // Dynamically add filters
        this.gridComponent.filters = contractFilters;

        // Refresh grid
        this.gridComponent.getRecordsForEntity();
      }
    }
  }

  onPDFDownload(record) {
     this.contractService.generateContractPDF({ contract: record})
     .pipe(take(1))
     .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
       alert('Could not generate Contract PDF')
       return e;
     }))
     .subscribe((data: any) => {
       window.open(environment.publicUrl + data.fileName, '_blank');
     })
  }

  ngAfterViewInit(){
    const contractFilters = [];
    contractFilters.push({
      condition: 'eq',
      value: this.account.id,
      field: 'accountId'
    } as GridFilter)

    // Dynamically add filters
    this.gridComponent.filters = contractFilters;

    // Refresh grid
    this.gridComponent.getRecordsForEntity();
  }


    newContract(){
      this.router.navigateByUrl('/contracts/new/customers/' + this.account.id);
    }

}
