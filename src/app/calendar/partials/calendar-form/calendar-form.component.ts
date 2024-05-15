import { Component, OnInit, Input } from '@angular/core';
import { Calendar } from '../../models/calendar.model';

@Component({
  selector: 'app-calendar-form',
  templateUrl: './calendar-form.component.html',
  styleUrls: ['./calendar-form.component.scss']
})
export class CalendarFormComponent implements OnInit {

  @Input()
  calendar: Calendar = new Calendar();
  constructor() { }

  ngOnInit(): void {
  }

}
