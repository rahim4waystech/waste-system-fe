import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FuelComponent } from './pages/fuel/fuel.component';
import { FuelPricesComponent } from './pages/fuel-prices/fuel-prices.component';
import { FuelPricesNewComponent } from './pages/fuel-prices-new/fuel-prices-new.component';
import { FuelPricesEditComponent } from './pages/fuel-prices-edit/fuel-prices-edit.component';
import { FuelAdvancedComponent } from './pages/fuel-advanced/fuel-advanced.component';
import { FuelNewComponent } from './pages/fuel-new/fuel-new.component';
import { FuelEditComponent } from './pages/fuel-edit/fuel-edit.component';
import { AuthGuard } from '../auth/guards/auth.guard';


const routes: Routes = [
  {
    path: 'fuel',
    component: FuelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel/new',
    component: FuelNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel/edit/:id',
    component: FuelEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel/prices',
    component: FuelPricesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel/prices/new',
    component: FuelPricesNewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel/prices/edit/:id',
    component: FuelPricesEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fuel/advanced',
    component: FuelAdvancedComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuelRoutingModule { }
