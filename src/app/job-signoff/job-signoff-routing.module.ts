import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobSignoffComponent } from './pages/job-signoff/job-signoff.component';
import { JobSignoffViewComponent } from './pages/job-signoff-view/job-signoff-view.component';
import { JobSignoffEditManagerComponent } from './pages/job-signoff-edit-manager/job-signoff-edit-manager.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'job-signoff',
    component: JobSignoffComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/view/:id',
    component: JobSignoffViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/manager/:id',
    component: JobSignoffEditManagerComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSignoffRoutingModule { }
