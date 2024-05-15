import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ArticTimelineTransportComponent } from './pages/artic-timeline-transport/artic-timeline-transport.component';

const routes: Routes = [
  {
    path: 'timeline/artics',
    component: ArticTimelineTransportComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticTimelineRoutingModule { }
