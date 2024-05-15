import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimelineWorkshopComponent } from './pages/timeline-workshop/timeline-workshop.component';

const routes: Routes = [
  {
    path: '4workshop/timeline/workshop',
    component: TimelineWorkshopComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineWorkshopRoutingModule { }
