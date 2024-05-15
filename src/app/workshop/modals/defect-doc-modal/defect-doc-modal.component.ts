import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/services/document.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { VehicleCheckReport } from '../../models/vehiclecheckreport.model';
import { DefectStateService } from '../../services/defect-state.service';

@Component({
  selector: 'app-defect-doc-modal',
  templateUrl: './defect-doc-modal.component.html',
  styleUrls: ['./defect-doc-modal.component.scss']
})
export class DefectDocModalComponent implements OnInit {
  @Input()
  report: VehicleCheckReport = new VehicleCheckReport();

  documents: any = [];

  constructor(
    private documentService:DocumentService,
    private modalService:ModalService,
    private defectStateService:DefectStateService
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.report){
      if(changes.report.currentValue.id !== -1){
        this.documentService.getDocumentsByEntityAndEntityId("driver-check",this.report.id)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}('Could not get Documents');return e;}))
        .pipe(take(1))
        .subscribe((docs) => {
          this.documents = docs;

          this.documents.forEach(doc => {
            if(doc.filetype.split("/")[0] === 'image'){
              this.documentService.getImageById(doc.id)
              .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}('Could not get Images');return e;}))
              .pipe(take(1))
              .subscribe((item:any) => {
                doc.data = item.data;
                doc.filetype = item.filetype;
                doc.filename = item.filename;
              })
            }
          })
        })
      }
    }
  }

  close() {
    this.defectStateService.$closedDefectModal.next();
    this.modalService.close('defectImageModal');
  }

}
