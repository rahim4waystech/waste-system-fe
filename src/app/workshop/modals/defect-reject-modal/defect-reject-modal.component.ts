import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { VehicleVorService } from 'src/app/vehicle/services/vehicle-vor.service';
import { VehicleCheckReport } from '../../models/vehiclecheckreport.model';
import { DefectStateService } from '../../services/defect-state.service';
import { VehicleCheckService } from '../../services/vehiclechecks.service';

@Component({
  selector: 'app-defect-reject-modal',
  templateUrl: './defect-reject-modal.component.html',
  styleUrls: ['./defect-reject-modal.component.scss']
})
export class DefectRejectModalComponent implements OnInit {
  @Input()
  report:VehicleCheckReport = new VehicleCheckReport();

  constructor(
    private modalService:ModalService,
    private defectStateService:DefectStateService,
    private vehicleCheckService:VehicleCheckService,
    private vehicleVorService: VehicleVorService
  ) { }

  ngOnInit(): void {
  }

  save(){
    this.vehicleCheckService.updateReport(this.report)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Update Report Status');return e;}))
    .pipe(take(1))
    .subscribe(() => {
      if(this.report.vehicleCheck.isVor){
        this.vehicleVorService.getVORByDateAndVehicleId(this.report.createdAt,this.report.vehicleId)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Remove VOR');return e;}))
        .pipe(take(1))
        .subscribe((vorDetails:any) => {
          // this.cancel();
          vorDetails.forEach((vor:any) => {
            vor.deleted = true;

            this.vehicleVorService.updateVehicleVOR(vor)
            .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Remove VOR');return e;}))
            .pipe(take(1))
            .subscribe(() => {

            })
          })
          this.cancel();
        })
      } else {
        this.cancel();
      }

    });
  }

  cancel() {
    this.reset();
    this.modalService.close('defectRejectModal');
  }

  reset() {
    this.defectStateService.$closedDefectModal.next();
  }

}
