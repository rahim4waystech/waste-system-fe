import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import * as moment from 'moment';
import { DefectService } from '../../services/defect.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { catchError, take } from 'rxjs/operators';
// import { CalendarService } from '../../services/calendar.service';

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
  selector: 'app-schedule',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  // @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

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
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];



  defect:any = {}

  constructor(
    private modal: NgbModal,
    private defectService:DefectService,
    private modalService:ModalService,
  ) {}

  ngOnInit() {
    this.loadEvents();
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
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

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.defect = {};
    this.defect = event;
    this.modalService.open('calendarInfoModal');
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

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;

    this.viewStartDate =  moment(this.viewDate).startOf('M').subtract(1,'w').toDate();
    this.viewEndDate = moment(this.viewDate).endOf('M').add(1,'w').toDate();

    this.loadEvents();
  }

  loadEvents(){
    this.calendarLoaded = false;
    this.events = [];
    this.defectService.getAllDefectsForDates(moment(this.viewStartDate).format('YYYY-MM-DD'),moment(this.viewEndDate).format('YYYY-MM-DD'))
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get events');return e;}))
    .pipe(take(1))
    .subscribe((eventData:any) => {

      eventData.forEach(item => {
        let itemDate: Date = new Date();
        if(item.bookedFor !== null){
          itemDate = moment(item.bookedFor).toDate();
        } else if(item.ended !== null){
          itemDate = moment(item.ended).toDate();
        } else if(item.started !== null){
          itemDate = moment(item.started).toDate();
        } else {
          itemDate = moment(item.updatedAt).toDate();
        }

        let itemName = '';
        let itemTitle = '';
        let itemType:any;


        // itemType = {
        //   primary: '#ad2121',
        //   secondary: '#FAE3E3',
        // }
        // itemName = item.vehicle.registration;

        switch(item.vehicleInspectionIntervalsId){
          case -1:
            itemType = {
              primary: '#00FFFF',
              secondary: '#00FFFF',
            }
            itemName = item.vehicle.registration + ' ' + item.description + '(Defect)';
            itemTitle = item.vehicle.registration + ' - ' + item.description +' (Defect)';
            break;
          case 1:
            itemType = {
              primary: item.inspectionInterval.colour,
              secondary: '#FFFFFF',
            };
            itemName = item.vehicle.registration + ' ' + item.description + '(Inspection)';
            itemTitle = item.vehicle.registration + ' - ' + item.inspectionInterval.name +' (Inspection)';
            break;
          case 2:
            itemType = {
              primary: item.inspectionInterval.colour,
              secondary: '#FFFFFF',
            };
            itemName = item.vehicle.registration + ' ' + item.description + '(MOT)';
            itemTitle = item.vehicle.registration + ' - ' + item.inspectionInterval.name +' (MOT)';
            break;
          case 3:
            itemType = {
              primary: item.inspectionInterval.colour,
              secondary: '#FFFFFF',
            };
            itemName = item.vehicle.registration + ' ' + item.description + '(Tachometer)';
            itemTitle = item.vehicle.registration + ' - ' + item.inspectionInterval.name +' (Tachometer)';
            break;
          case 4:
            itemType = {
              primary: item.inspectionInterval.colour,
              secondary: '#FFFFFF',
            };
            itemName = item.vehicle.registration + ' ' + item.description + '(Tax Expiry)';
            itemTitle = item.vehicle.registration + ' - ' + item.inspectionInterval.name +' (Tax Expiry)';
            break;
          default:
            itemType = {
              primary: '#00FFFF',
              secondary: '#00FFFF',
            };
            itemName = item.vehicle.registration + ' ' + item.description + '(Defect)';
            itemTitle = item.vehicle.registration + ' ' + item.description + '(Defect)';
            break;
        }

        let eventItem = {
          start: itemDate,
          end: itemDate,
          title: itemTitle,
          data: item,
          color: itemType,
          actions: this.actions,
          allDay: true,
          resizable: {
            beforeStart: false,
            afterStart: false
          },
          draggable: false
        }

        this.events.push(eventItem)
      })

      this.calendarLoaded = true;
    })
    this.activeDayIsOpen = false;

  }
}
