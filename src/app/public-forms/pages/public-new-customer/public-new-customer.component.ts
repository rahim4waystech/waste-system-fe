import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/core/services/sidebar.service';
import { HeaderService } from 'src/app/core/services/header.service';
import { environment } from 'src/environments/environment';
import { Account } from 'src/app/order/models/account.model';
import { AccountService } from 'src/app/account/services/account.service';
import { take, catchError } from 'rxjs/operators';
import { SIC } from 'src/app/account/models/sic.model';
import { AccountValidatorService } from 'src/app/account/validators/account-validator.service';
import { PublicFormsService } from '../../services/public-forms.service';
import { ActivatedRoute } from '@angular/router';
import { PublicFormToken } from '../../public-form-token.model';

@Component({
  selector: 'app-public-new-customer',
  templateUrl: './public-new-customer.component.html',
  styleUrls: ['./public-new-customer.component.scss']
})
export class PublicNewCustomerComponent implements OnInit {

  account: Account = new Account();

  sic: SIC[] = [];

  type: number = 0;

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  token: PublicFormToken = new PublicFormToken();

  constructor(private sidebarService: SidebarService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    private publicFormsService: PublicFormsService,
    private accountValidatorService: AccountValidatorService,
    private headerService: HeaderService) { }

  ngOnInit(): void {

    // Don't show bars they are not logged in
    this.sidebarService.visible = false;
    this.headerService.visible = false;

    // default is cash customer
    this.account.type_id = 13; // site for cash customer
    this.account.type = {id: 13} as any;
    this.account.accountRef = "0";
    this.account.parentId = environment.defaults.cashCustomerId;

    this.accountService.getAllSIC()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("sic codes could not be loaded");
      return e;
    }))
    .subscribe((data: SIC[]) => {
      this.sic = data;
    });


    this.route.params.subscribe((params) => {
      this.publicFormsService.getPublicFormTokenRecordByToken(params['token'])
      .pipe(take(1))
      .pipe(catchError((e) => {
        window.location.href = '/login';
        return e;
      }))
      .subscribe((data: any[]) => {
        if(data.length === 0) {
          window.location.href = '/login';
        }

        this.token = data[0] as any;

      })
    })

  }

getCompanyName(): string {
  return environment.invoicing.companyName;
}

foundBillingAddress(event){
  this.account.billingAddress1 = event.address1;
  this.account.billingAddress2 = event.address2;
  this.account.billingCity = event.city;
  this.account.billingCountry = event.country;
}

foundShippingAddress(event){
  this.account.shippingAddress1 = event.address1;
  this.account.shippingAddress2 = event.address2;
  this.account.shippingCity = event.city;
  this.account.shippingCountry = event.country;
}


confirmTransfer(){
  this.account.shippingAddress1 = this.account.billingAddress1;
  this.account.shippingAddress2 = this.account.billingAddress2;
  this.account.shippingCity = this.account.billingCity;
  this.account.shippingCountry = this.account.billingCountry;
  this.account.shippingPostCode = this.account.billingPostCode;
}

transferAddress(){
  if(
    this.account.shippingAddress1 !== '' ||
    this.account.shippingAddress2 !== '' ||
    this.account.shippingCity !== '' ||
    this.account.shippingCountry !== '' ||
    this.account.shippingPostCode !== ''
  ) {
    if(confirm('Overwrite Existing Shipping Details?')){
      this.confirmTransfer();
    }
  } else {
    this.confirmTransfer();
  }
}

save() {
  this.isError = false;
  this.isServerError = false;

  if(!this.accountValidatorService.isValid(this.account)) {
    this.isError = true;
    return;
  }

  // do call to api
  if(this.type === 0) {
    this.publicFormsService.createAccount(this.account)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((account) => {
      this.publicFormsService.deleteTokenById(this.token.id).subscribe(() => {
        this.isSuccess = true;
      })

    })
  } else {
    this.publicFormsService.createAccount(this.account)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((account: any) => {
      // now create the site

      const site:any = JSON.parse(JSON.stringify(account));
      site.id = -1;
      site.parentId = account.id;

      site.type_id = 13;
      site.type = {id: 13} as any;
      this.publicFormsService.createAccount(site)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((account) => {
        this.publicFormsService.deleteTokenById(this.token.id).subscribe(() => {
          this.isSuccess = true;
        })
      })
    })
  }
}

onCustomerTypeSelected($event) {
  this.type = +$event.target.value;


  if($event.target.value == '1') {
    // credit account
    this.account.type_id = 3;
    this.account.accountRef = "0";
    this.account.type = {id: 3} as any;
    this.account.parentId = -1;
  } else {
    // cash account
    this.account.type_id = 13; // site for cash customer
    this.account.type = {id: 13} as any;
    this.account.accountRef = "0";
    this.account.parentId = environment.defaults.cashCustomerId;
  }
}



}
