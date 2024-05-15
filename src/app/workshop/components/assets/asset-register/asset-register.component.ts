import { Component, OnInit, ViewChild } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { AssetService } from 'src/app/workshop/services/asset.service';
import { Part } from 'src/app/workshop/models/part.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { PartsStateService } from 'src/app/workshop/services/parts-state.service';

@Component({
  selector: 'app-asset-register',
  templateUrl: './asset-register.component.html',
  styleUrls: ['./asset-register.component.scss']
})
export class AssetRegisterComponent implements OnInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  buttons: GridButton[] = [
    {label: 'View', link: '/4workshop/assets/:id', type: 'btn-info', trigger: (record, button) =>  record.category.name !== "Part"} as GridButton,
    {label: 'View', type: 'btn-info', action: (button, record) => this.openModal('stockViewModal',record), trigger: (record, button) =>  record.category.name === "Part"} as GridButton,
    {label: 'Edit', type: 'btn-warning', action: (button, record) => this.openModal('stockEditModal',record), trigger: (record, button) =>  record.category.name === "Part"} as GridButton,
    {label: 'Stock Level', type: 'btn-success', action: (button, record) => this.openModal('stockChangeModal',record), trigger: (record, button) =>  record.category.name === "Part"} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Asset', field: 'asset'} as GridColumn,
    {active: true, label: 'In Stock', field: 'part', value:v => this.getStock(v)} as GridColumn,
    {active: true, label: 'Asset Category', field: 'category.name'} as GridColumn,
    {active: true, label: 'Serial', field: 'assetSerial'} as GridColumn,
    {active: true, label: 'Depot', field: 'depot.name', value: (v, r) => !r.depot ? 'N/A' : r.depot.name} as GridColumn,
    {active: true, label: 'Active', field: 'active', value: v => v ? '<span class="badge badge-success">Active</span>': '<span class="badge badge-danger">Inactive</span>'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []
  searchFields: any = ['category.name','asset','assetSerial','depot.name','active'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'category.name',
      label: 'Asset Category',
    } as GridSearchFilter,
    {
      field: 'asset',
      label: 'Asset',
    } as GridSearchFilter,
    {
      field: 'Serial',
      label: 'assetSerial',
    } as GridSearchFilter,
    {
      field: 'depot.name',
      label: 'Depot',
    } as GridSearchFilter,
    {
      field: 'active',
      label: 'Active',
    } as GridSearchFilter,
  ];
  targetItem: Part = new Part();

  constructor(
    private assetService: AssetService,
    private modalService: ModalService,
    private partsStateService: PartsStateService
  ) { }

  ngOnInit(): void {
    this.partsStateService.$closedModal.subscribe(() => {
      this.gridComponent.getRecordsForEntity();
    });

    // this.assetService.getAllAssets()
    // .subscribe(data => {
    // })
  }

  openModal(modal:string,record) {
    record.part.depot = record.depot;
    this.targetItem = record.part;
    this.modalService.open(modal);
  }

  getStock(v){
    if(v === null){
      return ''
    } else if ( v.qty === 0){
      return '<span class="badge badge-danger">No Stock</span>'
    } else if (v.qty > 0){
      return '<span class="badge badge-success">' + v.qty + ' In Stock</span>'
    }
  }

}
