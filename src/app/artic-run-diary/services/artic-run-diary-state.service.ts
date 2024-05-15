import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticRunDiaryStateService {

  $modalClosed: Subject<any> = new Subject();
  constructor() { }
}
