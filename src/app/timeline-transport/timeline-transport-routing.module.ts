import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TimelineTransportComponent } from './pages/timeline-transport/timeline-transport.component';


const routes: Routes = [
  {
    path: 'timeline',
    component: TimelineTransportComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineTransportRoutingModule { }
