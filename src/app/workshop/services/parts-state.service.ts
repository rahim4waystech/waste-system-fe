import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartsStateService {
  $closedModal:Subject<any> = new Subject();

  constructor() { }
}
