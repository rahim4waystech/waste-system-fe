import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';

@Component({
  selector: 'app-timeline-transport-vor-and-absence',
  templateUrl: './timeline-transport-vor-and-absence.component.html',
  styleUrls: ['./timeline-transport-vor-and-absence.component.scss']
})
export class TimelineTransportVorAndAbsenceComponent implements OnInit {
  @Input()
  data: any = {};

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  close() {
    // this.reset();
    this.modalService.close('vorModal');
  }

  getAbsenceEnd(date) {
    return moment(date).add(1, 'day').format('DD/MM/YY');
  }

}
