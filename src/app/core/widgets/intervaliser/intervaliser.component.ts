import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { Recurrence } from '../../models/recurrence.model';
import { RecurrenceService } from '../../services/recurrence.service';

@Component({
  selector: 'app-intervaliser',
  templateUrl: './intervaliser.component.html',
  styleUrls: ['./intervaliser.component.scss']
})
export class IntervaliserComponent implements OnInit {
  @Input()
  entity: any = {};

  showRecurrence: Boolean = false;

  intervals = [
    {name:'Days',value:'d'},
    {name:'Weeks',value:'w'},
    {name:'Months',value:'m'},
    {name:'Years',value:'y'}
  ]

  day = [
    {monday:false,value:0},
    {tuesday:false,value:1},
    {wednesday:false,value:2},
    {thursday:false,value:3},
    {friday:false,value:4},
    {saturday:false,value:5},
    {sunday:false,value:6}
  ]

  days = [
    {name:'Monday',value:0},
    {name:'Tuesday',value:1},
    {name:'Wednesday',value:2},
    {name:'Thursday',value:3},
    {name:'Friday',value:4},
    {name:'Saturday',value:5},
    {name:'Sunday',value:6},
  ]

  months = [
    {name:'January',value:0},
    {name:'February',value:1},
    {name:'March',value:2},
    {name:'April',value:3},
    {name:'May',value:4},
    {name:'June',value:5},
    {name:'July',value:6},
    {name:'August',value:7},
    {name:'September',value:8},
    {name:'October',value:9},
    {name:'November',value:10},
    {name:'December',value:11},
  ]

  showIntervals = true;
  showRecurrenceTab = false;
  showSetDays = false;

  dailyValues = {day:1};
  weeklyValues = {
    week: 1,
    days: {
      monday:false,
      tuesday:false,
      wednesday:false,
      thursday:false,
      friday:false,
      saturday:false,
      sunday:false
    }
  }

  monthByDayNoValues = {day:1,month:0}

  monthByDayValues = {
    interval:1,
    day:0,
    month:0
  }

  yearValues = {year:1}
  yearByDayNo = {day:1,month:0}
  yearByDay = {interval:1,day:0,month:0}

  recurrenceStartDate:string = '';
  recurrenceEndDate:string = '';
  endDate:string = '';
  storedId = -1;
  recurrenceType: string = '';

  saveSuccess:boolean = false;
  saveFail:boolean = false;

  constructor(
    private recurrenceService:RecurrenceService
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(simple: SimpleChanges) {
    if(simple.entity !== undefined) {
      if(simple.entity.currentValue.id > 0) {
        if(this.entity.recurrenceId !== -1 && this.entity.recurrenceId !== undefined && this.entity.recurrenceId !== null){
          this.recurrenceService.getByRecurrenceId(this.entity.recurrenceId)
          .pipe(take(1))
          .pipe(catchError((e) => {
            if(e.status === 403 || e.status === 401) {
              return e;
            }
            alert('Could not load recurrence');
            return e;
          }))
          .subscribe((recurrence: Recurrence) => {
            const recurranceObj = recurrence[0];

            this.showRecurrence = true;

            this.recurrenceStartDate = recurranceObj.startDate;
            this.recurrenceEndDate = recurranceObj.endDate;

            this.recurrenceType = recurranceObj.recurrenceType;

            switch(recurranceObj.recurrenceType){
              case 'daily':
                this.dailyValues.day = recurranceObj.timeValue;
                return;
              case 'weekly':
                this.weeklyValues.week = recurranceObj.timeValue;

                const days = recurranceObj.recurrenceWeekDays.split(",");

                days.forEach(day => {
                  switch(day){
                    case '0':this.weeklyValues.days.monday = true;break;
                    case '1':this.weeklyValues.days.tuesday = true;break;
                    case '2':this.weeklyValues.days.wednesday = true;break;
                    case '3':this.weeklyValues.days.thursday = true;break;
                    case '4':this.weeklyValues.days.friday = true;break;
                    case '5':this.weeklyValues.days.saturday = true;break;
                    case '6':this.weeklyValues.days.sunday = true;break;
                  }
                })

                return;
              case 'monthByDayNo':
                this.monthByDayNoValues.day = recurranceObj.recurrenceDayNo;
                this.monthByDayNoValues.month = recurranceObj.recurrenceMonthno;
                return;
              case 'monthByDay':
                this.monthByDayValues.interval = recurranceObj.recurrenceWeekno;
                this.monthByDayValues.day = recurranceObj.recurrenceDayNo;
                this.monthByDayValues.month = recurranceObj.timeValue;
                return;
              case 'year':
                this.yearValues.year = recurranceObj.timeValue;
                return;
              case 'yearByDayNo':
                this.yearByDayNo.month = recurranceObj.recurrenceMonthno;
                this.yearByDayNo.day = recurranceObj.timeValue;
                return;
              case 'yearByDay':
                this.yearByDay.interval = recurranceObj.recurrenceWeekno;
                this.yearByDay.day = recurranceObj.recurrenceDayNo;
                this.yearByDay.month = recurranceObj.recurrenceMonthno;
                return;
            }
          })
        }
      }
    }
  }

  selectMonthByDayValuesInterval(event){
    this.monthByDayValues.interval = parseInt(event.target.value,10);
  }

  selectMonthByDayDay(event){
    this.monthByDayValues.day = parseInt(event.target.value,10);
  }

  selectYearByDayNoInterval(event){
    this.yearByDayNo.month = parseInt(event.target.value,10);
  }

  selectYearByDayInterval(event){
    this.yearByDay.interval = parseInt(event.target.value,10);
  }

  selectYearByDayDay(event){
    this.yearByDay.day = parseInt(event.target.value,10);
  }

  selectYearByDayMonth(event){
    this.yearByDay.month = parseInt(event.target.value,10);
  }

  saveDaily(){
    const recurrenceSetup = new Recurrence();
    recurrenceSetup.startDate = this.recurrenceStartDate;
    recurrenceSetup.endDate = this.recurrenceEndDate;
    recurrenceSetup.recurrenceType = 'daily';

    recurrenceSetup.timeValue = this.dailyValues.day;
    recurrenceSetup.recurrenceAmount = this.dailyValues.day;
    recurrenceSetup.timeUnit = 'd';

    this.saveInterval(recurrenceSetup);
  }

  saveWeekly(){
    const recurrenceSetup = new Recurrence();
    recurrenceSetup.startDate = this.recurrenceStartDate;
    recurrenceSetup.endDate = this.recurrenceEndDate;
    recurrenceSetup.timeValue = this.weeklyValues.week;
    recurrenceSetup.timeUnit = 'w';
    recurrenceSetup.recurrenceType = 'weekly';

    let days = ',';

    if(this.weeklyValues.days.monday){days += '0,';}
    if(this.weeklyValues.days.tuesday){days += '1,';}
    if(this.weeklyValues.days.wednesday){days += '2,';}
    if(this.weeklyValues.days.thursday){days += '3,';}
    if(this.weeklyValues.days.friday){days += '4,';}
    if(this.weeklyValues.days.saturday){days += '5,';}
    if(this.weeklyValues.days.sunday){days += '6,';}

    recurrenceSetup.recurrenceWeekDays = days;
    this.saveInterval(recurrenceSetup);
  }

  saveMonthlyByDayNo(){
    const recurrenceSetup = new Recurrence();
    recurrenceSetup.startDate = this.recurrenceStartDate;
    recurrenceSetup.endDate = this.recurrenceEndDate;
    recurrenceSetup.recurrenceDayNo = this.monthByDayNoValues.day;
    recurrenceSetup.recurrenceMonthno = this.monthByDayNoValues.month;
    recurrenceSetup.recurrenceType = 'monthByDayNo';

    this.saveInterval(recurrenceSetup);
  }

  saveMonthlyByDay(){
    const recurrenceSetup = new Recurrence();
    recurrenceSetup.startDate = this.recurrenceStartDate;
    recurrenceSetup.endDate = this.recurrenceEndDate;
    recurrenceSetup.recurrenceType = 'monthByDay';

    recurrenceSetup.recurrenceWeekno = this.monthByDayValues.interval;
    recurrenceSetup.recurrenceDayNo = this.monthByDayValues.day;
    recurrenceSetup.timeValue = this.monthByDayValues.month;
    recurrenceSetup.timeUnit = 'm';

    this.saveInterval(recurrenceSetup);
  }

  saveYearly(){
    const recurrenceSetup = new Recurrence();
    recurrenceSetup.startDate = this.recurrenceStartDate;
    recurrenceSetup.endDate = this.recurrenceEndDate
    recurrenceSetup.recurrenceType = 'year';

    recurrenceSetup.timeValue = this.yearValues.year;
    recurrenceSetup.timeUnit = 'y';

    this.saveInterval(recurrenceSetup);
  }

  saveYearlyByDayNo(){
    const recurrenceSetup = new Recurrence();
    recurrenceSetup.startDate = this.recurrenceStartDate;
    recurrenceSetup.endDate = this.recurrenceEndDate;
    recurrenceSetup.recurrenceType = 'yearByDayNo';

    recurrenceSetup.recurrenceMonthno = this.yearByDayNo.month;
    recurrenceSetup.timeValue = this.yearByDayNo.day;
    recurrenceSetup.timeUnit = 'y';

    this.saveInterval(recurrenceSetup);
  }

  saveYearlyByDay(){
    const recurrenceSetup = new Recurrence();
    recurrenceSetup.startDate = this.recurrenceStartDate;
    recurrenceSetup.endDate = this.recurrenceEndDate;
    recurrenceSetup.recurrenceType = 'yearByDay';

    recurrenceSetup.recurrenceWeekno = this.yearByDay.interval;
    recurrenceSetup.recurrenceDayNo = this.yearByDay.day;
    recurrenceSetup.recurrenceMonthno = this.yearByDay.month;
    recurrenceSetup.timeValue = 1;
    recurrenceSetup.timeUnit = 'y';

    this.saveInterval(recurrenceSetup);
  }

  saveInterval(recurrence){
    if(this.recurrenceStartDate !== '' && this.recurrenceEndDate !== ''){
      if(recurrence.id === -1 || recurrence.id === undefined || recurrence.id === null){
        this.recurrenceService.save(recurrence)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not Create Recurrence');
          return e;
          this.saveFail = true;
        }))
        .subscribe((data:any) =>{
          if(this.entity.recurrenceId === -1){
            this.entity.recurrenceId = data.id;
            this.entity.recurrence = data;
            this.saveSuccess = true;
            this.recurrenceType = data.recurrenceType;
          }
        })
      } else {
        this.recurrenceService.update(recurrence)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not Update Recurrence');
          return e;
          this.saveFail = true;
        }))
        .subscribe((data:any)  => {
          this.entity.recurrenceId = data.id;
          this.entity.recurrence = data;
          this.saveSuccess = true;
          this.recurrenceType = data.recurrenceType;
        })
      }

    } else {
      alert('Please fill in all details')
    }
  }

  clearRecurrence(){
    this.recurrenceType = '';
    this.entity.recurrenceId = -1;
    this.entity.recurrence = new Recurrence();
  }
}
