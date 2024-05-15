import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { DocumentStateService } from 'src/app/core/services/document-state.service';
import { DocumentService } from 'src/app/core/services/document.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { VehicleService } from 'src/app/vehicle/services/vehicle.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.scss']
})
export class ViewDocumentsComponent implements OnInit {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;
  vehicle:Vehicle = new Vehicle();
  vehicleId:number = -1;
  image: any = {};

  buttons: GridButton[] = [
    {label: 'View', type: 'btn-info', action: (button, record) =>  this.viewDoc(record)} as GridButton,
  //  {label: 'Delete', link: '/visitor/delete/:id', type: 'btn-danger',} as GridButton,
  ]


  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Filename', field: 'filename'} as GridColumn,
    {active: true, label: 'Filetype', field: 'filetype'} as GridColumn,
    {active: true, label: 'Original Filename', field: 'originalFilename'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [

  ]
  searchFields: any = ['filename','filetype','originalFilename','createdAt','updatedAt'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'filename',
      label: 'Filename',
    } as GridSearchFilter,
    {
      field: 'originalFilename',
      label: 'Original Filename',
    } as GridSearchFilter,
    {
      field: 'filetype',
      label: 'File Type',
    } as GridSearchFilter
  ]

  constructor(
    private route: ActivatedRoute,
    private vehicleService:VehicleService,
    private documentService:DocumentService,
    private modalService:ModalService,
    private documentStateService:DocumentStateService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      this.vehicleId = parseInt(params['id']);

      this.filters = [
        {field:'entity', condition:'eq',value:'vehicle'},
        {field:'entityId', condition:'eq',value:this.vehicleId}
      ];

      this.vehicleService.getVehicleById(this.vehicleId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not find vehicle');return e;}))
      .pipe(take(1))
      .subscribe((vehicle:Vehicle) => {
        this.vehicle = vehicle;
      })

      this.documentStateService.$closedModal.subscribe(() => {
        this.gridComponent.getRecordsForEntity();
      });
    })
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

  viewDoc(document){
    const filetype = document.filetype.split("/")[0];

    if(filetype === 'image'){
      this.documentService.getImageById(document.id)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Image');console.log(e);return e;}))
      .pipe(take(1))
      .subscribe((image:any) => {
        const imageObject = {
          data:image.data,
          filetype:document.filetype
        };
        this.image = imageObject;
        this.modalService.open('viewImageModal');
      })
    } else {
      window.open(environment.publicUrl + 'documents/viewdoc/' + document.id, '_blank');
    }
  }
}
