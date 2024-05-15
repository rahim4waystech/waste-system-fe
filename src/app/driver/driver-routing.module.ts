import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DriversComponent } from './pages/drivers/drivers.component';
import { DriverNewComponent } from './pages/driver-new/driver-new.component';
import { DriverEditComponent } from './pages/driver-edit/driver-edit.component';
import { DriverAbsenceComponent } from './pages/driver-absence/driver-absence.component';
import { DriverAbsenceNewComponent } from './pages/driver-absence-new/driver-absence-new.component';
import { DriverAbsenceEditComponent } from './pages/driver-absence-edit/driver-absence-edit.component';
import { DriverAbsenceCancelComponent } from './pages/driver-absence-cancel/driver-absence-cancel.component';
import { DriverHoursComponent } from './pages/driver-hours/driver-hours.component';
import { DriverHoursAdvancedComponent } from './pages/driver-hours-advanced/driver-hours-advanced.component';
import { DriverHoursNewComponent } from './pages/driver-hours-new/driver-hours-new.component';
import { DriverHoursEditComponent } from './pages/driver-hours-edit/driver-hours-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DriverBonusLevelComponent } from './pages/driver-bonus-level/driver-bonus-level.component';
import { DriverBonusLevelNewComponent } from './pages/driver-bonus-level-new/driver-bonus-level-new.component';
import { DriverBonusLevelEditComponent } from './pages/driver-bonus-level-edit/driver-bonus-level-edit.component';


const routes: Routes = [
  {
    path: 'drivers',
    component: DriversComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/new',
    component: DriverNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/edit/:id',
    component: DriverEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/absence',
    component: DriverAbsenceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/absence/new',
    component: DriverAbsenceNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/absence/edit/:id',
    component: DriverAbsenceEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/absence/cancel/:id',
    component: DriverAbsenceCancelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/hours',
    component: DriverHoursComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/hours/advance',
    component: DriverHoursAdvancedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/hours/new',
    component: DriverHoursNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/hours/edit/:id',
    component: DriverHoursEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/bonus',
    component: DriverBonusLevelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/bonus/new',
    component: DriverBonusLevelNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'drivers/bonus/edit/:id',
    component: DriverBonusLevelEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
