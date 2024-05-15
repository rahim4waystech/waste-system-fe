import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShredderImporterRoutingModule } from './shredder-importer-routing.module';
import { ShredderImporterComponent } from './pages/shredder-importer/shredder-importer.component';


@NgModule({
  declarations: [ShredderImporterComponent],
  imports: [
    CommonModule,
    ShredderImporterRoutingModule
  ]
})
export class ShredderImporterModule { }
