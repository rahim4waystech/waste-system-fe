import { Component, OnInit, Input } from '@angular/core';
import { Defect } from 'src/app/workshop/models/defect.model';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-timeline-workshop-defect-information',
  templateUrl: './timeline-workshop-defect-information.component.html',
  styleUrls: ['./timeline-workshop-defect-information.component.scss']
})
export class TimelineWorkshopDefectInformationComponent implements OnInit {

  @Input()
  defect: Defect = new Defect();
  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  close() {
    this.modalService.close('defectInformationModal');
  }

}
