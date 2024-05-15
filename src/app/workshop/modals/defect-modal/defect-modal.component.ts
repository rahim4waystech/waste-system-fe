import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/services/document.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Defect } from '../../models/defect.model';
import { VehicleCheckReport } from '../../models/vehiclecheckreport.model';
import { DefectStateService } from '../../services/defect-state.service';
import { DefectService } from '../../services/defect.service';
import { VehicleCheckService } from '../../services/vehiclechecks.service';

@Component({
  selector: 'app-defect-modal',
  templateUrl: './defect-modal.component.html',
  styleUrls: ['./defect-modal.component.scss']
})
export class DefectModalComponent implements OnInit {
  @Input()
  defect: Defect = new Defect();
  @Input()
  report: VehicleCheckReport = new VehicleCheckReport();

  vehicle:Vehicle = new Vehicle();

  constructor(
    private defectService: DefectService,
    private modalService: ModalService,
    private defectStateService: DefectStateService,
    private vehicleCheckService: VehicleCheckService,
    private documentService:DocumentService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges){

    // Load inspection int3ervals after vehicles has loaded
    if(changes.defect) {
      if(changes.defect.currentValue.vehicleId !== -1) {
        this.vehicle = this.defect.vehicle;
      }
    }
  }

  save(){
    if(this.validate()){
      if(this.defect.bookedFor === ''){this.defect.bookedFor = null};

      this.defectService.createDefect(this.defect)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Create new Defect');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.report.checkStatusId = 3;
        this.vehicleCheckService.updateReport(this.report)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Update Report Status');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          // Update documents next
          this.documentService.getDocumentsByEntityAndEntityId("driver-check",this.report.id)
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Retrieve linked Documents');return e;}))
          .pipe(take(1))
          .subscribe((docs:any) => {
            docs.forEach(doc => {
              doc.entity = 'defect';
              this.documentService.addDoc(doc)
              .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Update Documents');return e;}))
              .pipe(take(1))
              .subscribe(() => {})
            })
          })

          this.cancel();
        })
      })
    } else {
      alert('Please check all marked items')
    }


  }

  cancel() {
    this.reset();
    this.modalService.close('defect-modal');
  }

  reset() {
    this.defectStateService.$closedDefectModal.next();
    // this.part = new Part();
    // this.newQty = 0;
  }

  validate(){
    let result = true;

    if(this.defect.vehicleId === -1 || this.defect.vehicleId === null || this.defect.vehicleId === undefined){
      result = false;
    }
    if(this.defect.vehicleCheckAreaId === -1 || this.defect.vehicleCheckAreaId === null || this.defect.vehicleCheckAreaId === undefined){
      result = false;
    }
    if(this.defect.vehicleSeverityId === -1 || this.defect.vehicleSeverityId === null || this.defect.vehicleSeverityId === undefined){
      result = false;
    }
    if(this.defect.description === '' || this.defect.description.length === 0 || this.defect.description === null || this.defect.description === undefined){
      result = false;
    }

    if(this.defect.depotId === -1 || this.defect.depotId === null || this.defect.depotId === undefined){
      if(this.defect.workshopSubcontractorsId === -1 || this.defect.workshopSubcontractorsId === null || this.defect.workshopSubcontractorsId === undefined){
        result = false;
      }
    }

    return result;
  }
}
