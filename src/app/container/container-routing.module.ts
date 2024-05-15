import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent } from './pages/container/container.component';
import { ContainersNewComponent } from './pages/containers-new/containers-new.component';
import { ContainersEditComponent } from './pages/containers-edit/containers-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'containers',
    component: ContainerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'containers/new',
    component: ContainersNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'container/edit/:id',
    component: ContainersEditComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainerRoutingModule { }
