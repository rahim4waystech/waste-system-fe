import { ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { CorrespondenceStateService } from '../../services/correspondence-state.service';
import { Correspondence } from '../../models/correspondence.model';

@Component({
  selector: 'app-correspondence-grid',
  templateUrl: './correspondence-grid.component.html',
  styleUrls: ['./correspondence-grid.component.scss']
})
export class CorrespondenceGridComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;


  @Input()
  entity: string = '';

  @Input()
  data: any = {};

  buttons: GridButton[] = [
    {label: 'Edit', type: 'btn-warning', action: (button, record) => {
      this.currentRecord = record;
      this.modalService.open('correspondenceEditModal');

    }} as GridButton,
    {label: 'View Email', type: 'btn-warning', trigger: (record, button) => record.emailLog, action: (button, record) => {
      let html  = "<html><head><title>"+ record.emailLog.subject + "| " + record.emailLog.to + "</title></head><body>" + record.emailLog.content + "</body></html>";

      let win = window.open();
      win.document.write(html);
    }} as GridButton,
   ]
   columns: GridColumn[] = [
     {active: true, label: '#', field: 'id'} as GridColumn,
     {active: true, label: 'Subject', field: 'subject'} as GridColumn,
     {active: true, label: 'Type', field: 'correspondenceType.name'} as GridColumn,
     {active: true, label: 'Date', field: 'date', value: v => moment(v).format('DD/MM/yyyy')} as GridColumn,
     {active: true, label: 'Person', field: 'user.id', value: (v,r) => r.user.firstName + ' ' + r.user.lastName} as GridColumn,
   ];

   // Org filter handled at API level
   filters: GridFilter[] = [

   ]
   searchFields: any = [];

   searchFilters: GridSearchFilter[] = [
   ]

   currentRecord: Correspondence = new Correspondence();

  constructor(private modalService: ModalService, private correspondenceStateService: CorrespondenceStateService) { }

  ngOnInit(): void {
    this.correspondenceStateService.$refreshGrid.subscribe(() => {
      this.gridComponent.getRecordsForEntity();
    })
  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.data.currentValue.id !== -1) {

      this.gridComponent.selectedFilters = [];
      this.gridComponent.selectedFilters.push({
        condition: 'eq',
        field: 'entityId',
        value: this.data.id,
      });

      this.gridComponent.selectedFilters.push({
        condition: 'eq',
        field: 'entity',
        value: this.entity,
      })

      this.gridComponent.getRecordsForEntity();
    }
  }

  openModal(name: string) {
    this.modalService.open(name);
  }

  ngAfterViewInit() {
    this.gridComponent.selectedFilters = [];
    this.gridComponent.selectedFilters.push({
      condition: 'eq',
      field: 'entityId',
      value: this.data.id,
    });

    this.gridComponent.selectedFilters.push({
      condition: 'eq',
      field: 'entity',
      value: this.entity,
    })

    this.gridComponent.getRecordsForEntity();
  }

}
