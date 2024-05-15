import { Component, OnInit, Input } from '@angular/core';
import { Fitter } from '../../models/fitter.model';
import { AccountService } from 'src/app/account/services/account.service';
import { catchError, take } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';

@Component({
  selector: 'app-fitter-form',
  templateUrl: './fitter-form.component.html',
  styleUrls: ['./fitter-form.component.scss']
})
export class FitterFormComponent implements OnInit {

  @Input()
  fitter: Fitter = new Fitter();

  depots: Account[] = [];
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {

    this.accountService.getAllDepots()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('depots could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((depots: Account[]) => {
      this.depots = depots;
    });
  }

}
