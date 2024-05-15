import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ContractService } from '../../service/contract.service';
import { catchError, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {


  risks = [
    '',
    'Low',
    'Medium',
    'High',
  ]

  buttons: GridButton[] = [
    {label: 'Edit', link: '/contracts/edit/:id', type: 'btn-warning',} as GridButton,
    {label: 'PDF', type: 'btn-info', action: (button, record) => {this.onPDFDownload(record);},} as GridButton,

  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Account', field: 'account.name'} as GridColumn,
    {active: true, label: 'Status', field: 'contractStatus.name'} as GridColumn,
    {active: true, label: 'Type', field: 'contractType.name'} as GridColumn,
    {active: true, label: 'Risk', field: 'riskLevel'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'name',
      label: 'Name',
    } as GridSearchFilter,
  ]


  constructor(
    private contractService:ContractService
  ) { }

  ngOnInit(): void {
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



}
