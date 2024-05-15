import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShredderImporterComponent } from './pages/shredder-importer/shredder-importer.component';


const routes: Routes = [
  {
    path: 'shredding/import',
    component: ShredderImporterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShredderImporterRoutingModule { }
