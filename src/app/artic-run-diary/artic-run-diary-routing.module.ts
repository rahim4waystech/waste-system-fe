import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticAddJobDetailsComponent } from './pages/artic-add-job-details/artic-add-job-details.component';
import { ArticAddJobComponent } from './pages/artic-add-job/artic-add-job.component';
import { ArticRunDiaryComponent } from './pages/artic-run-diary/artic-run-diary.component';

const routes: Routes = [
  {
    path: 'artics/run-diary',
    component: ArticRunDiaryComponent,
  },
  {
    path: 'artics/job/orders/:date',
    component: ArticAddJobComponent,
  },
  {
    path: 'artics/job/new/:orderId/:date',
    component: ArticAddJobDetailsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticRunDiaryRoutingModule { }
