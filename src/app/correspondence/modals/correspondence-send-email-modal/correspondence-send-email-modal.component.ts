import { Component, OnInit, Input } from '@angular/core';
import { EmailLog } from '../../models/email-log.model';
import { Correspondence } from '../../models/correspondence.model';
import * as moment from 'moment';
import { CorrespondenceService } from '../../services/correspondence.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { EmailValidatorService } from '../../validators/email.validator.service';
import { take, catchError } from 'rxjs/operators';
import { CorrespondenceStateService } from '../../services/correspondence-state.service';

@Component({
  selector: 'app-correspondence-send-email-modal',
  templateUrl: './correspondence-send-email-modal.component.html',
  styleUrls: ['./correspondence-send-email-modal.component.scss']
})
export class CorrespondenceSendEmailModalComponent implements OnInit {

  @Input()
  data: any = {};

  @Input()
  entity: string = '';

  isError: boolean = false;
  isServerError: boolean = false;


  emailLog: EmailLog = new EmailLog();
  constructor(private correspondenceService: CorrespondenceService,
    private correspondenceStateService: CorrespondenceStateService,
    private emailValidatorService: EmailValidatorService,
    private modalService: ModalService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.emailLog = new EmailLog();
    this.modalService.close('correspondenceSendEmailModal');
  }

  save() {

    this.isError = false;
    this.isServerError = false;

    if(!this.emailValidatorService.isValid(this.emailLog)) {
      this.isError = true;
      return;
    }

    this.correspondenceService.sendEmail(this.emailLog)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not send email');
      return e;
    }))
    .subscribe((log: EmailLog) => {
      this.emailLog = log;
      this.saveCorrespondence();
    })
  }

  saveCorrespondence() {
    const correspondence = new Correspondence();
    correspondence.subject = this.emailLog.subject;
    correspondence.description = "Email sent to " + this.emailLog.to;
    correspondence.date = moment().format('YYYY-MM-DD');
    correspondence.correspondenceTypeId = 2;
    correspondence.correspondenceType = {id: 2} as any;
    correspondence.entity = this.entity;
    correspondence.entityId = this.data.id;
    correspondence.emailLogId = this.emailLog.id;
    correspondence.emailLog = {id: this.emailLog.id} as any;

    this.correspondenceService.createCorrespondence(correspondence)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not create');
      return e;
    }))
    .subscribe(() => {
      this.correspondenceStateService.$refreshGrid.next(true);
      this.cancel();
    })
  }

}
