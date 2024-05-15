import { Injectable } from '@angular/core';
import * as moment from 'moment';

export class TimelineHistoryEvent {
  type: TimelineHistoryEventType;
  data: any = {};
  dateTime: string = '';
}

export enum TimelineHistoryEventType {
  deleteJobs,
  approveJobs,
  unapproveJobs, 
  addUnit,
  deleteUnit,
  editUnit,
  addJob,
  addNote,
  copyJobs,
}


@Injectable({
  providedIn: 'root'
})
export class TimelineTransportHistoryService {

  MAX_STACK_SIZE: number = 20;

  historyStack: TimelineHistoryEvent[] = [];
  constructor() { }

  
  addEvent(eventType: TimelineHistoryEventType, data: any) {
    let event = new TimelineHistoryEvent();
    event.dateTime = moment().format('YYYY-MM-DD H:i:s');
    event.type = eventType;
    event.data = data;

    this.addEventObject(event);
  }

  addEventObject(historyEvent: TimelineHistoryEvent) {

    // Never exceed the max history stack of 20 to avoid memory issues
    if(this.historyStack.length === this.MAX_STACK_SIZE) {
      this.historyStack.shift(); 
    }

    this.historyStack.push(historyEvent);
  }

  getLastitem() {
    return this.historyStack.pop();
  }

  clear() {
    this.historyStack = [];
  }
}
