import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GridColumn } from '../models/grid-column.model';

@Injectable({
  providedIn: 'root'
})
export class GridStateService {

  $gridColumnsUpdated: Subject<GridColumn[]> = new Subject();
  constructor() { }
}
