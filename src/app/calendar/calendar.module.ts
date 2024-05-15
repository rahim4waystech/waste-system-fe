import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '../core/core.module';
import { CalendarFormComponent } from './partials/calendar-form/calendar-form.component';
import { CalendarNewComponent } from './pages/calendar-new/calendar-new.component';
import { CalendarEditComponent } from './pages/calendar-edit/calendar-edit.component';
import { CalendarViewComponent } from './pages/calendar-view/calendar-view.component';
import { CalendarModule as CalendarModulePlugin, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CalendarAddEventModalComponent } from './modals/calendar-add-event-modal/calendar-add-event-modal.component';
import { CalendarEditEventModalComponent } from './modals/calendar-edit-event-modal/calendar-edit-event-modal.component';
@NgModule({
  declarations: [CalendarComponent, CalendarFormComponent, CalendarNewComponent, CalendarEditComponent, CalendarViewComponent, CalendarAddEventModalComponent, CalendarEditEventModalComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CalendarModulePlugin.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BsDatepickerModule.forRoot(),
    CoreModule,
    CalendarRoutingModule
  ]
})
export class CalendarModule { }
