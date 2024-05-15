import { Component, OnInit, ViewChild } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';

@Component({
  selector: 'app-quoting',
  templateUrl: './quoting.component.html',
  styleUrls: ['./quoting.component.scss']
})
export class QuotingComponent implements OnInit {

  quoteStatusCurrent: string = "";

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  buttons: GridButton[] = [
    {label: '<i class="fas fa-pencil-alt"></i>', link: '/quoting/edit/:id', type: 'btn-warning',} as GridButton,
    {label: '<i class="fas fa-check-circle"></i>', link: '/quoting/accept/:id', type: 'btn-success', trigger: (record) => record.quoteStatus.name !== 'Accepted'} as GridButton,
    {label: '<i class="fas fa-times-circle"></i>', link: '/quoting/decline/:id', type: 'btn-danger',trigger: (record) => record.quoteStatus.name !== 'Accepted'} as GridButton,
    // {label: '<i class="fas fa-copy"></i>', link: '/quoting/copy/:id', type: 'btn-info'} as GridButton,
  ]


  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {active: true, label: 'Site', field: 'account.name', value: (v,r) => r.account ? r.account.name : 'N/A' } as GridColumn,
    {active: true, label: 'Quote Number', field: 'quoteNumber'} as GridColumn,
    {active: true, label: 'Description', field: 'description'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []

  searchFields: any = ['name','quoteNumber','description','account.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'name',
      label: 'Name',
    } as GridSearchFilter,
    {
      field: 'quoteNumber',
      label: 'Quote Number',
    } as GridSearchFilter,
    {
      field: 'description',
      label: 'Description',
    } as GridSearchFilter,
    {
      field: 'account.name',
      label: 'Site Name',
    } as GridSearchFilter
  ]

  ngOnInit(): void {
  }

  setQuoteStatus(status: string) {
    this.quoteStatusCurrent = status;

    if(this.quoteStatusCurrent !== '') {
      this.gridComponent.selectedFilters = [
        {
          condition: 'eq',
          field: 'quoteStatus.name',
          value: this.quoteStatusCurrent,
        }  as GridSelectedFilter
      ]
      this.gridComponent.getRecordsForEntity();
      this.gridComponent.onValueChanged();
    } else {
      this.gridComponent.selectedFilters = [];
      this.gridComponent.getRecordsForEntity();
      this.gridComponent.onValueChanged();
    }
  }

}
