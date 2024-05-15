import { Component, OnInit, ViewChild } from '@angular/core';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { Router } from '@angular/router';
import { PublicFormsService } from 'src/app/public-forms/services/public-forms.service';
import { PublicFormToken } from 'src/app/public-forms/public-form-token.model';
import { catchError, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  viewActiveAccounts:Boolean = true;
  viewProspects:Boolean = false;
  accountTypeFilter: string = 'all';

  constructor(private router: Router,
    private accountService: AccountService,
    private publicFormService: PublicFormsService) { }

  ngOnInit(): void {
  }

  getAddressDetails(value, record): string {
    let address = '';

    if(record.billingAddress1.trim() !== '') {
      address += record.billingAddress1 + '<br />';
    }

    if(record.billingAddress2.trim() !== '') {
      address += record.billingAddress2 + '<br />';
    }

    if(record.billingCity.trim() !== '') {
      address += record.billingCity + '<br />';
    }

    if(record.billingCountry.trim() !== '') {
      address += record.billingCountry + '<br />';
    }

    if(record.billingPostCode.trim() !== '') {
      address += record.billingPostCode;
    }

    return address;
  }

  onGenerateLink($event) {
    const token = this.uuidv4();

    const tokenObj = new PublicFormToken();
    tokenObj.token = token;

    this.publicFormService.createToken(tokenObj)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not create token');
      return e;
    }))
    .subscribe((token) => {
      prompt("Please copy the following link and send to the customer to sign up.", "http://localhost:4200/public/new/customer/" + tokenObj.token);
    })

  }

  changeAccountStoppage(account: Account, onStop: boolean) {
    account.onStop = onStop;
    this.accountService.updateAccount(account)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not put account on stop. Please try again later');
      return e;
    }))
    .subscribe((account) => {})
  }

  getColorFromType(record) {
    const typeId = record.type_id;
    switch(typeId) {
      case 3: //customer
        return '#16a085'
      case 8: // prospect
        return '#8e44ad';
      case 15: // tip
        return '#2980b9';
      case 14: // depot
        return '#2c3e50';

       default:
        return '#7f8c8d';
    }
  }

 uuidv4() {
   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
     return v.toString(16);
   });
  }
}
