import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobSignoffLandStateService {

  $jobIdChanged: Subject<number> = new Subject();
  $editJobDialogClosed: Subject<any> = new Subject();
  constructor() { }
}
