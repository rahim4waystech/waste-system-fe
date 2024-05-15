import { Component, OnInit } from '@angular/core';
import { CalendarView, CalendarEvent as CalendarEventPlugin, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DefectService } from 'src/app/workshop/services/defect.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { isSameMonth, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { Calendar } from '../../models/calendar.model';
import { CalendarService } from '../../services/calendar.service';
import { catchError, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CalendarEventService } from '../../services/calendar-event.service';
import { CalendarEvent } from '../../models/calendar-event.model';
import { CorrespondenceService } from 'src/app/correspondence/services/correspondence.service';
import { Correspondence } from 'src/app/correspondence/models/correspondence.model';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {

  activeDayIsOpen: boolean = false;
  calendarLoaded:boolean = false;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = moment().toDate()
  viewStartDate : Date =  moment(this.viewDate).startOf('M').subtract(1,'w').toDate();
  viewEndDate : Date =  moment(this.viewDate).endOf('M').add(1,'w').toDate();
  // viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEventPlugin;
  };

  actions: CalendarEventAction[] = [];

  refresh: Subject<any> = new Subject();

  events: CalendarEventPlugin[] = [];
  calendarEvents: CalendarEvent[] = [];



  defect:any = {}

  calendar: Calendar = new Calendar();

  currentEvent: CalendarEvent = new CalendarEvent();

  constructor(
    private modal: NgbModal,
    private calendarEventService: CalendarEventService,
    private calendarService:CalendarService,
    private correspondenceService: CorrespondenceService,
    private route:ActivatedRoute,
    private modalService:ModalService,
  ) {}

  ngOnInit() {
   

    this.route.params.subscribe((params) => {
      this.loadCalendar(+params['id']);
    })
  }

  loadCalendar(id:number) {
    this.calendarService.getCalendarById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load calendar');
      return e;
    }))
    .subscribe((calendar: Calendar) => {
      this.calendar = calendar;
      this.loadCorrespondence();
    })
  }

  loadCorrespondence() {
    this.correspondenceService.getByCalenderId(this.calendar.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load Correspondence');
      return e;
    }))
    .subscribe((correspondence: Correspondence[]) => {

      correspondence.forEach((event: Correspondence) => {
        const eventNew = {} as CalendarEventPlugin;
        eventNew.allDay = true;
        eventNew.title = "<strong>All Day</strong> - " + event.subject;
        eventNew.start = moment(event.date).toDate();
        eventNew.end = moment(event.date).toDate();
        eventNew.meta = -1;
        eventNew.color = <any>this.calendar.colour;

        this.events.push(eventNew);
      })

      this.loadEvents();
    })
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEventPlugin[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEventPlugin): void {


    const calendarEvent = this.calendarEvents.filter(ce => ce.id === event.meta)[0]; 

    if(calendarEvent) {
      this.currentEvent = calendarEvent;
    }

    // if -1 one it was created as corr record and cannot be editted.
    if(event.meta !== -1) {
      this.modalService.open('calendarEditEventModal');
    }
    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEventPlugin) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;

    this.viewStartDate =  moment(this.viewDate).startOf('M').subtract(1,'w').toDate();
    this.viewEndDate = moment(this.viewDate).endOf('M').add(1,'w').toDate();

    this.loadCorrespondence();
  }

  loadEvents(){
    this.calendarLoaded = false;
    this.events = [];


    this.calendarEventService.getAllEventsForCalendar(this.calendar.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load events for calendar');
      return e;
    }))
    .subscribe((data: CalendarEvent[]) => {
      this.calendarEvents = data;
      data.forEach((event: CalendarEvent) => {
        const eventNew = {} as CalendarEventPlugin;
        eventNew.allDay = event.isFullDay;
        eventNew.title = event.isFullDay ? "<strong>All Day</strong> - " + event.name : '<strong>'+ event.startTime + '/' + event.endTime +'</strong> - ' + event.name;
        eventNew.start = moment(event.date + ' ' + event.startTime).toDate();
        eventNew.end = moment(event.date + ' ' + event.endTime).toDate();
        eventNew.meta = event.id;
        eventNew.color = <any>'gray'

        this.events.push(eventNew);
      })

      this.calendarLoaded = true;
    })

  }

  openAddModal() {
    this.modalService.open('calendarAddEventModal');
  }


}
