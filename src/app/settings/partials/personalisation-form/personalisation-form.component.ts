import { Component, OnInit, Input } from '@angular/core';
import { UserSettingsService } from '../../services/user-settings.service';
import { catchError, take } from 'rxjs/operators';
import { Personalisation } from '../../models/personalisation.model';

@Component({
  selector: 'app-personalisation-form',
  templateUrl: './personalisation-form.component.html',
  styleUrls: ['./personalisation-form.component.scss']
})
export class PersonalisationFormComponent implements OnInit {
  @Input()
  personalisationSettings:Personalisation = new Personalisation();

  constructor(
    private userSettingsService: UserSettingsService
  ) { }

  ngOnInit(): void {

  }

}
