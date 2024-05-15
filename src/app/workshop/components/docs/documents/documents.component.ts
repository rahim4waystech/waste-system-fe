import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { catchError, take } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { DocumentService } from 'src/app/core/services/document.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
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
    {field:'entity', condition:'ne',value:'folder'}
  ];
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
  ];

  image: any = {};

  constructor(
    private documentService:DocumentService,
    private modalService:ModalService,
  ) { }

  ngOnInit(): void {
  }

  viewDoc(document){

    const filetype = document.filetype.split("/")[0];

    if(filetype === 'image'){
      this.documentService.getImageById(document.id)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Image');return e;}))
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
