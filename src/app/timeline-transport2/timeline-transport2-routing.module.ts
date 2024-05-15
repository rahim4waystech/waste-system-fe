import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimelineTransport2Component } from './pages/timeline-transport2/timeline-transport2.component';
import { AuthGuard } from '../auth/guards/auth.guard';






const routes: Routes = [
  {
    path: 'timeline2',
    component: TimelineTransport2Component,
 
 canActivate: [AuthGuard],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})






export class TimelineTransport2RoutingModule { }
