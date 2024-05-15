import { Component, Input, OnInit } from '@angular/core';
import { Account } from 'src/app/order/models/account.model';
import { AccountValidatorService } from '../../validators/account-validator.service';
import { AccountService } from '../../services/account.service';
import { take, catchError } from 'rxjs/operators';
import { AccountType } from 'src/app/order/models/account-type.model';
import { CompaniesHouseService } from 'src/app/core/services/companies-house.service';
import { LogoService } from 'src/app/core/services/logo.service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/order/services/order.service';
import { ModalService} from '../../../core/services/modal.service';
import {OrderStateService} from '../../../order/services/order-state.service';

@Component({
  selector: 'app-accounts-new',
  templateUrl: './accounts-new.component.html',
  styleUrls: ['./accounts-new.component.scss']
})
export class AccountsNewComponent implements OnInit {


  account: Account = new Account();

  @Input()
  parentID: number;

  @Input()
  isSimpleOrder: boolean = false;

  isError: boolean = false;
  isServerError: boolean = false;

  sameSite: any = {sameSite: false};
  sameTip: any = {sameTip: false};

  @Input()
  isPopup: boolean = false;

  constructor(private accountValidatorService: AccountValidatorService,
              private logoService: LogoService,
              private router: Router,
              private companyHouseService: CompaniesHouseService,
              private accountService: AccountService,
              private orderStateService: OrderStateService,
              private orderService: OrderService,
              private modalService: ModalService) { }

  ngOnInit(): void {

  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.accountValidatorService.isValid(this.account)) {
      // try to save logo first then save account
      this.saveAccount();
    } else {
      this.isError = true;
    }
  }

  saveAccount() {
    this.accountService.createAccount(this.account)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((account: Account) => {
      // move to edit mode
      if(this.sameSite.sameSite) {
        this.createDefaultSite(account.id);
      } else {
        if (this.isPopup  && !this.isSimpleOrder) {
          window.location.reload();
        } else if (this.isSimpleOrder){
          // do state for simple order here
          this.orderStateService.companyAdded$.next(account);
          this.modalService.close('addCustomerAccountOrderModal');
        } else {
          window.location.href = '/accounts';
         }
      }
    });
  }

  createDefaultSite(accountId: number) {

    if(!accountId) {
      throw new Error('must have a valid account id to create a new site');
    }

    const site: Account = JSON.parse(JSON.stringify(this.account));
    site.id = -1;
    site.parentId = accountId;
    site.type = {} as AccountType;
    site.type.id = 13; //site
    site.type_id = site.type.id;

    this.accountService.createAccount(site)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not create a site automatically');
      return e;
    }))
    .subscribe((account: Account) => {
     if (this.sameTip.sameTip) {
        this.createDefaultTip(accountId);
     } else {
      if (this.isPopup && !this.isSimpleOrder) {
        window.location.reload();
       } else if (this.isSimpleOrder) {
        this.accountService.getAccountById(account.parentId)
          .pipe(take(1))
          .pipe(catchError((e) => {
            if (e.status === 403 || e.status === 401) {
              return e;
            }
            alert('Could not create a site automatically');
            return e;
          }))
          .subscribe((siteAccount: Account) => {


            this.orderStateService.siteAndCompanyAdded$.next(siteAccount);
            this.modalService.close('addCustomerAccountOrderModal');
          });
       } else {
        window.location.href = '/accounts';
       }
     }
    });
  }

  saveLogo() {

    if(this.account.logo && this.account.logo !== "") {
      this.saveAccount();
      return;
    }

    this.logoService.getLogoFromWebsite(this.account.website)
    .pipe(take(1))
    .pipe(catchError((e) => {
      // If logo failed still save account
      // alert('Could not fetch logo for account');
      this.saveAccount();
      return e;
    }))
    .subscribe((logo: string) => {
      this.account.logo = logo;
     this.saveAccount();
    })
  }

  createDefaultTip(accountId: number) {

    if(!accountId) {
      throw new Error('must have a valid account id to create a new tip');
    }


    const site: Account = JSON.parse(JSON.stringify(this.account));
    site.id = -1;
    site.parentId = -1;
    site.type = {} as AccountType;
    site.type.id = 15; //site
    site.type_id = site.type.id;

    this.accountService.createAccount(site)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not create a tip automatically');
      return e;
    }))
    .subscribe((data) => {
     if(this.isPopup) {
      window.location.reload();
     } else {
      window.location.href = '/accounts';
     }
    })
  }

  cancel() {
    if (this.isPopup  && !this.isSimpleOrder) {
      window.location.reload();
    } else if (this.isSimpleOrder){
      this.modalService.close('addCustomerAccountOrderModal');
    } else {
      this.router.navigateByUrl('/accounts');
    }
  }

}
