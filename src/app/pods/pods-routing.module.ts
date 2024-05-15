import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PodsComponent } from './pages/pods/pods.component';
import { PodsViewComponent } from './pages/pods-view/pods-view.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DeletePodComponent } from './pages/delete-pod/delete-pod.component';

const routes: Routes = [
  {
    path: 'pods',
    component: PodsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pods/view/:id',
    component: PodsViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pods/delete/:id',
    component: DeletePodComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PodsRoutingModule { }
