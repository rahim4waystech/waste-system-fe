import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobSignoffWorkshopManagerViewComponent } from './pages/job-signoff-workshop-manager-view/job-signoff-workshop-manager-view.component';
import { JobSignoffWorkshopComponent } from './pages/job-signoff-workshop/job-signoff-workshop.component';

const routes: Routes = [
  {
    path: '4workshop/signoff',
    component: JobSignoffWorkshopComponent,
  },
  {
    path: '4workshop/signoff/view/:id',
    component: JobSignoffWorkshopManagerViewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobSignoffWorkshopRoutingModule { }
