import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobSignoffLandComponent } from './pages/job-signoff-land/job-signoff-land.component';
import { JobSignoffLandViewComponent } from './pages/job-signoff-land-view/job-signoff-land-view.component';
import { JobSignoffLandEditComponent } from './pages/job-signoff-land-edit/job-signoff-land-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JobSignoffDeleteJobComponent } from './pages/job-signoff-delete-job/job-signoff-delete-job.component';
import { JobSignoffLandDeleteAllJobsComponent } from './pages/job-signoff-land-delete-all-jobs/job-signoff-land-delete-all-jobs.component';
import { JobSignoffInvoiceGeneratePreviewComponent } from './pages/job-signoff-invoice-generate-preview/job-signoff-invoice-generate-preview.component';


const routes: Routes = [
  {
    path: 'job-signoff/land',
    component: JobSignoffLandComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/land/view/:id',
    component: JobSignoffLandViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/land/view/:id/:mode',
    component: JobSignoffLandViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/land/edit/:id',
    component: JobSignoffLandEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/land/delete/:id',
    component: JobSignoffDeleteJobComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/land/deleteall/:ids',
    component: JobSignoffLandDeleteAllJobsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'job-signoff/land/invoice/preview/:ids/:showPods',
    component: JobSignoffInvoiceGeneratePreviewComponent,

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSignoffLandServicesRoutingModule { }
