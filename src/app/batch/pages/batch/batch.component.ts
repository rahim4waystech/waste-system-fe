import { Component, OnInit } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { environment } from 'src/environments/environment';
import { BatchService } from '../../services/batch.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss']
})
export class BatchComponent implements OnInit {

  batchDate: string = '';

  buttons: GridButton[] = [
    {label: 'Download', type: 'btn-primary', action: (button, record) => {
      window.open( environment.publicUrl + 'batchfiles/' + record.filename)
    }} as GridButton,
   ]
   columns: GridColumn[] = [
     {active: true, label: '#', field: 'id'} as GridColumn,
     {active: true, label: 'File Name', field: 'filename'} as GridColumn,
     {active: true, label: 'Created By', field: 'user.firstName', value: (v, r) => r.user.firstName + ' ' + r.user.lastName} as GridColumn,
     {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    //  {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
   ];

   // Org filter handled at API level
   filters: GridFilter[] = [
   ]

   searchFields: any = ['filename','createdAt'];

   searchFilters: GridSearchFilter[] = [
     {
       field: 'filename',
       label: 'File name',
     } as GridSearchFilter,
     {
       field: 'createdAt',
       label: 'Created On',
       type: 'date',
     } as GridSearchFilter,
   ]
  constructor(private batchService: BatchService) { }

  ngOnInit(): void {
  }

  generate() {
    if(!this.batchDate || this.batchDate === '') {
      alert("Please provide a date for batch generation");
    }

    this.batchService.generateBatchExportForDate(this.batchDate)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Could not generate batch. Try again later")
      return e;
    }))
    .subscribe((data:any) => {
      window.open(environment.publicUrl + 'batchfiles/' + data.filename);
      window.location.reload();
    })
  }

}
