import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-workshop-subcontractors',
  templateUrl: './workshop-subcontractors.component.html',
  styleUrls: ['./workshop-subcontractors.component.scss']
})
export class WorkshopSubcontractorsComponent implements OnInit {
  buttons: GridButton[] = [
    {label: '<i class="fas fa-eye"></i>', link: '/4workshop/subcontractors/:id', type: 'btn-success',} as GridButton
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Name', field: 'name'} as GridColumn,
    {
      active: true, label: 'Type', field: 'parentId', value:(v,r)=>r.parentId===-1?'Subcontractor':'Depot'
    } as GridColumn,
    {active: true, label: 'Location', field: 'city'} as GridColumn,
    {active: true, label: 'Phone', field: 'phone'} as GridColumn
  ];
  // Org filter handled at API level
  filters: GridFilter[] = [];

  searchFields: any = ['name','parentId','city','phone'];

  searchFilters: GridSearchFilter[] = [
    {field: 'name',label: 'Name',} as GridSearchFilter,
    {field: 'city',label: 'Location',} as GridSearchFilter,
    {field: 'phone',label: 'Phone',} as GridSearchFilter,
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
