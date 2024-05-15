import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { CalendarNewComponent } from './pages/calendar-new/calendar-new.component';
import { CalendarEditComponent } from './pages/calendar-edit/calendar-edit.component';
import { CalendarViewComponent } from './pages/calendar-view/calendar-view.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar/new',
    component: CalendarNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar/edit/:id',
    component: CalendarEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar/view/:id',
    component: CalendarViewComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
