import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobSignoffArticComponent } from './pages/job-signoff-artic/job-signoff-artic.component';
import { JobSignoffArticViewComponent } from './pages/job-signoff-artic-view/job-signoff-artic-view.component';
import { JobSignoffArticEditComponent } from './pages/job-signoff-artic-edit/job-signoff-artic-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'job-signoff/artic',
    component: JobSignoffArticComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/artic/view/:id',
    component: JobSignoffArticViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/artic/edit/:id',
    component: JobSignoffArticEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSignoffArticRoutingModule { }
