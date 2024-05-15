import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticRunDiaryRoutingModule } from './artic-run-diary-routing.module';
import { ArticRunDiaryComponent } from './pages/artic-run-diary/artic-run-diary.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ArticRunDiarySetAllocationModalComponent } from './modals/artic-run-diary-set-allocation-modal/artic-run-diary-set-allocation-modal.component';
import { CoreModule } from '../core/core.module';
import { NgSelectConfig, NgSelectModule, ɵs } from '@ng-select/ng-select';
import { ArticRunDiarySetStatusComponent } from './modals/artic-run-diary-set-status/artic-run-diary-set-status.component';
import { ArticAddJobComponent } from './pages/artic-add-job/artic-add-job.component';
import { ArticAddJobDetailsComponent } from './pages/artic-add-job-details/artic-add-job-details.component';


@NgModule({
  declarations: [ArticRunDiaryComponent, ArticRunDiarySetAllocationModalComponent, ArticRunDiarySetStatusComponent, ArticAddJobComponent, ArticAddJobDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    BrowserModule,
    NgSelectModule,
    BsDatepickerModule,
    ArticRunDiaryRoutingModule
  ],
  providers: [
    NgSelectConfig,
    ɵs,
  ]
})
export class ArticRunDiaryModule { }
