import { Component, OnInit, Input } from '@angular/core';
import { EnvironmentSettings } from '../../models/environment-settings.model';
import { AccountService } from 'src/app/account/services/account.service';
import { catchError, take } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';
import { WorkshopSubcontractorsService } from 'src/app/workshop/services/workshop-subcontractors.service';

@Component({
  selector: 'app-environment-form',
  templateUrl: './environment-form.component.html',
  styleUrls: ['./environment-form.component.scss']
})
export class EnvironmentFormComponent implements OnInit {
  @Input()
  environment:EnvironmentSettings = new EnvironmentSettings();

  depots: any = [];

  constructor(
    private accountService:AccountService,
    private workshopService: WorkshopSubcontractorsService
  ) { }

  ngOnInit(): void {
    this.accountService.getAllDepots()
    .pipe(catchError((e)=>{alert('Could not get Depots');return e;}))
    .pipe(take(1))
    .subscribe(depots => {
      this.depots = depots;
    })
  }

}
