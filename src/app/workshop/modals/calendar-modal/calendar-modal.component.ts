import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { Defect } from '../../models/defect.model';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss']
})
export class CalendarModalComponent implements OnInit {
  @Input()
  defect: any = [];

  constructor(
    private modalService: ModalService,
    private router:Router
  ) { }

  ngOnInit(){

  }
  viewPage(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${"/4workshop/defect/" + this.defect.data.id}`])
    );

    window.open(url, '_blank');
  }

  close() {
    this.modalService.close('calendarInfoModal');
  }
}
