import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentStateService {
  $closedModal:Subject<any> = new Subject();

  constructor() { }
}
