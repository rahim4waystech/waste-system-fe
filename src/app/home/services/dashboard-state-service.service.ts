import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardStateServiceService {

  $datesChanged: Subject<any> = new Subject();
  // $startDateUpdated: Subject<string> = new Subject();
  // $endDateUpdated: Subject<string> = new Subject();

  constructor() { }
}
