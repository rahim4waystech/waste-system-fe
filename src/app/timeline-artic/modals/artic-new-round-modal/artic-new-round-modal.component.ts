import { Component, OnInit, Input } from '@angular/core';
import { JobAssignment } from 'src/app/timeline-skip/models/job-assignment.model';
import { JobAssignmentService } from 'src/app/timeline-skip/services/job-assignment.service';
import * as moment from 'moment';
import { TimelineArticStateService } from '../../services/timeline-artic-state.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-artic-new-round-modal',
  templateUrl: './artic-new-round-modal.component.html',
  styleUrls: ['./artic-new-round-modal.component.scss']
})
export class ArticNewRoundModalComponent implements OnInit {
  @Input()
  slotId:number = 0;

  @Input()
  newRoute: JobAssignment = new JobAssignment();
  @Input()
  date: string = moment().format('YYYY-MM-DD');
  
  isError: boolean = false;
  isServerError: boolean = false;

  constructor(
    private jobAssignmentService: JobAssignmentService,
    private articStateService: TimelineArticStateService,
    private modalService:ModalService
  ) { }

  ngOnInit(): void {
  }

  save(){
    if(this.validate()){

      if(this.newRoute.id === undefined || this.newRoute.id === -1){
        this.newRoute.slotNumber = this.slotId;
        this.newRoute.date = this.date;
        this.newRoute.orderTypeId = 4; //artics order

        this.jobAssignmentService.createJobAssignment(this.newRoute).subscribe(() => {
          this.articStateService.$articRoundAdded.next();
          this.reset();
          this.modalService.close('createArticRoute');
        })
      } else {
        if(this.newRoute.subcontractor === null){
          delete this.newRoute.subcontractor
        }
        this.jobAssignmentService.updateJobAssignment(this.newRoute).subscribe(() => {
          this.articStateService.$articRoundAdded.next();
          this.reset();
          this.modalService.close('createArticRoute');
        })
      }

    } else {
      this.isError = true;
    }
  }

  validate(){
    let result = true;
    if(this.newRoute.name === '' || this.newRoute.name.length <= 0){
      result = false;
    }

    if(this.newRoute.driverStartTime === ''){
      result = false;
    }

    return result;
  }


  cancel() {
    this.reset();
    this.modalService.close('createArticRoute');
  }

  reset() {
    this.newRoute = new JobAssignment();
    this.isError = false;
    this.isServerError = false;
  }

}
