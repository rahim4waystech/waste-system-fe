import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsComponent } from './pages/jobs/jobs.component';
import { JobsEditComponent } from './pages/jobs-edit/jobs-edit.component';
import { JobsNewSelectOrderComponent } from './pages/jobs-new-select-order/jobs-new-select-order.component';
import { JobsNewComponent } from './pages/jobs-new/jobs-new.component';


const routes: Routes = [
  {
    path: 'jobs',
    component: JobsComponent,
  },
  {
    path: 'jobs/edit/:id',
    component: JobsEditComponent,
  },
  {
    path: 'jobs/new/order',
    component: JobsNewSelectOrderComponent,
  },
  {
    path: 'jobs/new/order/:id',
    component: JobsNewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
