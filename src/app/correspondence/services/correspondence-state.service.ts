import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceStateService {

  constructor() { }

  $refreshGrid: Subject<any> = new Subject();
}
