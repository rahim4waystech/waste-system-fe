import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { VehicleNewComponent } from './pages/vehicle-new/vehicle-new.component';
import { VehicleEditComponent } from './pages/vehicle-edit/vehicle-edit.component';
import { VehiclesVorComponent } from './pages/vehicles-vor/vehicles-vor.component';
import { VehiclesVorNewComponent } from './pages/vehicles-vor-new/vehicles-vor-new.component';
import { VehiclesVorEditComponent } from './pages/vehicles-vor-edit/vehicles-vor-edit.component';
import { VehiclesVorCancelComponent } from './pages/vehicles-vor-cancel/vehicles-vor-cancel.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'vehicles',
    component: VehiclesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicles/new',
    component: VehicleNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicles/edit/:id',
    component: VehicleEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicles/vor',
    component: VehiclesVorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicles/vor/new',
    component: VehiclesVorNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicles/vor/edit/:id',
    component: VehiclesVorEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicles/vor/delete/:id',
    component: VehiclesVorCancelComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
