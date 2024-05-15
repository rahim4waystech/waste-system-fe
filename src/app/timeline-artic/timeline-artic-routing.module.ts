import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimelineArticComponent } from './pages/timeline-artic/timeline-artic.component';


/* WARNING THIS IS NOT USED ANYMORE THE ARTIC TIMELINE IS IN NOW IN TRANSPORT AS OPTION*/
const routes: Routes = [
  // {path:'artics',component:TimelineArticComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineArticRoutingModule { }
