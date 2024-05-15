import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FittersComponent } from './pages/fitters/fitters.component';
import { FitterNewComponent } from './pages/fitter-new/fitter-new.component';
import { FitterEditComponent } from './pages/fitter-edit/fitter-edit.component';
import { FitterHoursAdvancedComponent } from './pages/fitter-hours-advanced/fitter-hours-advanced.component';
import { FitterHoursComponent } from './pages/fitter-hours/fitter-hours.component';
import { FitterHoursNewComponent } from './pages/fitter-hours-new/fitter-hours-new.component';
import { FitterHoursEditComponent } from './pages/fitter-hours-edit/fitter-hours-edit.component';
import { FitterAbsenceComponent } from './pages/fitter-absence/fitter-absence.component';
import { FitterAbsenceEditComponent } from './pages/fitter-absence-edit/fitter-absence-edit.component';
import { FitterAbsenceNewComponent } from './pages/fitter-absence-new/fitter-absence-new.component';
import { FitterAbsenceCancelComponent } from './pages/fitter-absence-cancel/fitter-absence-cancel.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '4workshop/fitters',
    component: FittersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/new',
    component: FitterNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/edit/:id',
    component: FitterEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/hours/advanced',
    component: FitterHoursAdvancedComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/hours',
    component: FitterHoursComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/hours/new',
    component: FitterHoursNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/hours/edit/:id',
    component: FitterHoursEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/absence',
    component: FitterAbsenceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/absence/new',
    component: FitterAbsenceNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/absence/edit/:id',
    component: FitterAbsenceEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '4workshop/fitters/absence/cancel/:id',
    component: FitterAbsenceCancelComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FitterRoutingModule { }
