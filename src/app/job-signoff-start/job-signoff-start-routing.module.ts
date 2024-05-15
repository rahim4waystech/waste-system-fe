import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSignoffStartComponent } from './pages/job-signoff-start/job-signoff-start.component';

const routes: Routes = [
  {
    path: 'job-signoff/start',
    component: JobSignoffStartComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSignoffStartRoutingModule { }
