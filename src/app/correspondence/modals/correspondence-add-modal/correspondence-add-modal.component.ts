import { Component, OnInit, Input } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { Calendar } from 'src/app/calendar/models/calendar.model';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { CorrespondenceType } from '../../models/correspondence-type.model';
import { Correspondence } from '../../models/correspondence.model';
import { CorrespondenceStateService } from '../../services/correspondence-state.service';
import { CorrespondenceService } from '../../services/correspondence.service';
import { CorrespondenceValidatorService } from '../../validators/correspondence.validator.service';

@Component({
  selector: 'app-correspondence-add-modal',
  templateUrl: './correspondence-add-modal.component.html',
  styleUrls: ['./correspondence-add-modal.component.scss']
})
export class CorrespondenceAddModalComponent implements OnInit {

  @Input()
  entity: string = '';

  @Input()
  data: any = {};

  isError: boolean = false;
  isServerError: boolean = false;

  correspondence: Correspondence = new Correspondence();
  types: CorrespondenceType[] = [];

  calendars: Calendar[] = [];


  constructor(private correspondenceService: CorrespondenceService,
    private calendarService: CalendarService,
    private correspondenceValidatorService: CorrespondenceValidatorService,
    private modalService: ModalService,
    private correspondenceStateService: CorrespondenceStateService) { }

    ngOnInit(): void {
      this.correspondenceService.getAllTypes()
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('Could not load types');
        return e;
      }))
      .subscribe((types: any) => {
        this.types = types;
      })

      this.calendarService.getAll()
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('Could not get calendars');
        return e;
      }))
      .subscribe((calendars: Calendar[]) => {
        this.calendars = calendars;
      })
    }
  
    save() {
  
      this.correspondence.entity = this.entity;
      this.correspondence.entityId = this.data.id;
      if(!this.correspondenceValidatorService.isValid(this.correspondence)) {
        return;
      }
  
      this.correspondenceService.createCorrespondence(this.correspondence)
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
  
    cancel() {
      this.correspondence = new Correspondence();
      this.modalService.close('correspondenceAddModal');
    }

}
