import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';

@Component({
  selector: 'app-artic-timeline-transport-vor-and-absence',
  templateUrl: './artic-timeline-transport-vor-and-absence.component.html',
  styleUrls: ['./artic-timeline-transport-vor-and-absence.component.scss']
})
export class ArticTimelineTransportVorAndAbsenceComponent implements OnInit {
  @Input()
  data: any = {};

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  close() {
    // this.reset();
    this.modalService.close('ArticvorModal');
  }

  getAbsenceEnd(date) {
    return moment(date).add(1, 'day').format('DD/MM/YY');
  }

}
