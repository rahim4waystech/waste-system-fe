import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/order/models/account.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountValidatorService } from '../../validators/account-validator.service';
import { AccountService } from '../../services/account.service';
import { take, catchError } from 'rxjs/operators';
import { TippingPrice } from '../../models/tipping-price.model';
import { CustomerDetails } from '../../models/customer-details.model';
import { TipDetails } from '../../models/tip-details.model';
import { DepotDetails } from '../../models/depot-details.model';
import { CreditLimit } from '../../models/credit-limit.model';
import { LogoService } from 'src/app/core/services/logo.service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {


  account: Account = new Account();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  tippingPrices: any = {tippingPrices: []};
  customerDetails: CustomerDetails = new CustomerDetails();
  tipDetails: TipDetails = new TipDetails();
  depotDetails: DepotDetails = new DepotDetails();
  creditLimit: CreditLimit = new CreditLimit();


  constructor(private route: ActivatedRoute,
    private accountValidatorService: AccountValidatorService,
    private router: Router,
    private logoService: LogoService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadAccount(+params['id']);
    })

    // Can't cache the route when going from account to site.
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
  }

  loadCustomerDetails() {
    this.accountService.getAllCustomerDetails(this.account.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load tipping prices')
      return e;
    }))
    .subscribe((data: CustomerDetails) => {
      this.customerDetails = data[0];
      if(this.customerDetails === undefined) {
        this.customerDetails = new CustomerDetails();
      }
    })
  }

  loadCreditLimit() {
    this.accountService.getCreditLimit(this.account.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load credit limit')
      return e;
    }))
    .subscribe((data: CreditLimit) => {
      this.creditLimit = data[0];
      if(this.creditLimit === undefined) {
        this.creditLimit = new CreditLimit();
      }
    })
  }

  loadTipDetails() {
    this.accountService.getAllTipDetails(this.account.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load tipping details')
      return e;
    }))
    .subscribe((data: TipDetails) => {
      this.tipDetails = data[0];

      if(this.tipDetails === undefined) {
        this.tipDetails = new TipDetails();
      }
    })
  }

  loadDepotDetails() {
    this.accountService.getAllDepotDetails(this.account.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load depot details')
      return e;
    }))
    .subscribe((data: DepotDetails) => {
      this.depotDetails = data[0];

      if(this.depotDetails === undefined) {
        this.depotDetails = new DepotDetails();
      }
    })
  }

  loadTippingPrices() {
    this.accountService.getAllTippingPrices(this.account.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load tipping prices')
      return e;
    }))
    .subscribe((data: TippingPrice[]) => {
      this.tippingPrices.tippingPrices = data;
    })
  }


  loadAccount(id: number): void {
    this.accountService.getAccountById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      this.isServerError = true;
      return e;
    }))
    .subscribe((account: Account) => {
      this.account = account;

      // if tip load prices
      if(this.account.type_id === 15) {
        this.loadTippingPrices();
        this.loadTipDetails();
      }

      if(this.account.type_id === 14) {
        this.loadDepotDetails();
      }

      // If customer loads additional details not stored on CRM
      if(this.account.type_id === 3 || this.account.type_id === 16) {
        this.loadCustomerDetails();
        this.loadCreditLimit();
      }
    })
  }

  getTitle(): string {
    return !this.account.type?.name ? 'Account' : this.account.type.name;
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.accountValidatorService.isValid(this.account)) {
      this.saveLogo();
    } else {
      this.isError = true;
    }
  }

  saveLogo() {

    if(true) {
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

  saveAccount() {
    // try to save it
    this.accountService.updateAccount(this.account)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      this.isServerError = true;
      return e;
    }))
    .subscribe(() => {
      // if tip save tipping prices as well
      if(this.account.type_id === 15) {
        this.bulkTippingPrices(this.tippingPrices.tippingPrices);
      } else if(this.account.type_id === 3 || this.account.type_id === 16) {
        this.saveCustomerDetails();
      } else if(this.account.type_id === 14) {
        this.saveDepotDetails();
      } else {
        this.isSuccess = true;
      }
    })
  }
  saveDepotDetails() {
    this.depotDetails.depotId = this.account.id;

    if(this.depotDetails.id === -1) {
      this.accountService.createDepotDetails(this.depotDetails)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data: DepotDetails) => {
        this.depotDetails = data;

        this.isSuccess = true;
      })
    } else {
      this.accountService.updateDepotDetails(this.depotDetails)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data: DepotDetails) => {
        this.depotDetails = data;

        this.isSuccess = true;
      })
    }
  }

  saveTipDetails() {
    this.tipDetails.tipId = this.account.id;

    if(this.tipDetails.id === -1) {
      this.accountService.createTipDetails(this.tipDetails)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data: TipDetails) => {
        this.tipDetails = data;

        this.isSuccess = true;
      })
    } else {
      this.accountService.updateTipDetails(this.tipDetails)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data: TipDetails) => {
        this.tipDetails = data;

        this.isSuccess = true;
      })
    }
  }

  saveCreditLimit() {
    this.creditLimit.accountId = this.account.id;

    if(this.creditLimit.id === -1) {
      this.accountService.createCreditLimit(this.creditLimit)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not create credit limit. Please try again later');
        return e;
      }))
      .subscribe((data: CreditLimit) => {
        this.creditLimit = data;
        this.isSuccess = true;
      })
    } else {
      this.accountService.updateCreditLimit(this.creditLimit)
      .pipe(take(1))
      .pipe(catchError((e) => {

        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not update credit limit')
        return e;
      }))
      .subscribe(() => {
        this.isSuccess = true;
      })
    }
  }

  saveCustomerDetails() {
    this.customerDetails.accountId = this.account.id;

    if(this.customerDetails.id === -1) {
      this.accountService.createCustomerDetails(this.customerDetails)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data: CustomerDetails) => {
        this.customerDetails = data;

        this.saveCreditLimit();
      })
    } else {
      this.accountService.updateCustomerDetails(this.customerDetails)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data: CustomerDetails) => {
        this.customerDetails = data;

        this.saveCreditLimit();
      })
    }
  }

  bulkTippingPrices(tippingPrices: TippingPrice[]) {
    if(!TippingPrice) {
      this.isServerError = true;
    }

    tippingPrices.forEach(price => {
      price.site = this.account;
      price.siteId = this.account.id;
    });

    if(tippingPrices.length === 0) {
      this.saveTipDetails();
    } else {
      this.accountService.createBulkTippingPrices(tippingPrices)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data) => {
        this.saveTipDetails();
        this.tippingPrices.tippingPrices = data;
      })
    }
  }
}
