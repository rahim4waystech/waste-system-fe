import { Component, OnInit,Input } from '@angular/core';
import { Correspondence } from '../../models/correspondence.model';
import { catchError, take } from 'rxjs/operators';
import { CorrespondenceType } from '../../models/correspondence-type.model';
import { CorrespondenceService } from '../../services/correspondence.service';
import { CorrespondenceValidatorService } from '../../validators/correspondence.validator.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { CorrespondenceStateService } from '../../services/correspondence-state.service';
import { CalendarService } from 'src/app/calendar/services/calendar.service';
import { Calendar } from 'src/app/calendar/models/calendar.model';

@Component({
  selector: 'app-correspondence-edit-modal',
  templateUrl: './correspondence-edit-modal.component.html',
  styleUrls: ['./correspondence-edit-modal.component.scss']
})
export class CorrespondenceEditModalComponent implements OnInit {

  @Input()
  correspondence: Correspondence = new Correspondence();

  isError: boolean = false;
  isServerError: boolean = false;

  types: CorrespondenceType[] = [];

  calendars: Calendar[]= [];


  constructor(private correspondenceService: CorrespondenceService,
    private correspondenceValidatorService: CorrespondenceValidatorService,
    private calendarService: CalendarService,
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
      if(!this.correspondenceValidatorService.isValid(this.correspondence)) {
        return;
      }
  
      this.correspondenceService.updateCorrespondence(this.correspondence)
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
      // this.correspondence = new Correspondence();
      this.modalService.close('correspondenceEditModal');
    }

}
