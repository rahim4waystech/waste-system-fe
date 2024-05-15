import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import * as moment from 'moment';

@Component({
  selector: 'app-skip-vor-and-absence',
  templateUrl: './skip-vor-and-absence.component.html',
  styleUrls: ['./skip-vor-and-absence.component.scss']
})
export class SkipVorAndAbsenceComponent implements OnInit {

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
