import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ArticRoute } from '../models/articRoute.model';

@Injectable({
  providedIn: 'root'
})
export class TimelineArticStateService {
  $articDragDataChanged:Subject<any> = new Subject();
  $articRoundAdded: Subject<any> = new Subject();
  $articOrderAdded: Subject<any> = new Subject();

  constructor() { }
}
