import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefectStateService {
  $closedDefectModal:Subject<any> = new Subject();

  constructor() { }
}
