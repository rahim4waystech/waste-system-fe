import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TimelineSkipComponent } from './pages/timeline-skip/timeline-skip.component';


const routes: Routes = [
  {
    path: 'skips',
    component: TimelineSkipComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimelineSkipRoutingModule { }
