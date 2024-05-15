import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-site-delete',
  templateUrl: './site-delete.component.html',
  styleUrls: ['./site-delete.component.scss']
})
export class SiteDeleteComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private location: Location,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.accountService.getAccountById(+params['id'])
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('could not load site');
        return e;
      }))
      .subscribe((site: Account) => {
        site.isactive = false;

        this.accountService.updateAccount(site)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401){return e;}
          alert('could not update site')
          return e;
        }))
        .subscribe((account: Account) => {
          this.location.back();
        })
      })
    })
  }

}
