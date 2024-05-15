import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Account } from 'src/app/order/models/account.model';
import { AccountType } from 'src/app/order/models/account-type.model';
import { AccountService } from '../../services/account.service';
import { catchError, take } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import * as moment from 'moment';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { TippingPrice } from '../../models/tipping-price.model';
import { OrderService } from 'src/app/order/services/order.service';
import { Grade } from 'src/app/container/models/grade.model';
import { Unit } from 'src/app/order/models/unit.model';
import { ContainerService } from 'src/app/container/services/container.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { AccountStateService } from '../../services/account-state.service';
import { CustomerDetails } from '../../models/customer-details.model';
import { CustomerCategory } from '../../models/customer-category.model';
import { TipDetails } from '../../models/tip-details.model';
import { DepotDetails } from '../../models/depot-details.model';
import { SIC } from '../../models/sic.model';
import { environment } from 'src/environments/environment';
import { CreditLimit } from '../../models/credit-limit.model';
import { AccountRating } from 'src/app/order/models/account-rating.model';
import { IncumbentService } from '../../services/incumbent.service';
import { AccountIncumbents } from '../../models/account-incumbents.model';
import { Industry } from 'src/app/order/models/industry.model';
import { IndustryService } from '../../services/industry.service';
import { ContactService } from 'src/app/contact/service/contact.service';
import { ContractService } from 'src/app/contract/service/contract.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts-form',
  templateUrl: './accounts-form.component.html',
  styleUrls: ['./accounts-form.component.scss']
})
export class AccountsFormComponent implements OnInit, OnChanges {
  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;

  @Input()
  tippingPrices: any = {tippingPrices: []};

  @Input()
  customerDetails: CustomerDetails = new CustomerDetails();

  @Input()
  tipDetails: TipDetails = new TipDetails();


  @Input()
  depotDetails: DepotDetails = new DepotDetails();

  @Input()
  account: Account = new Account();

  @Input()
  creditLimit: CreditLimit = new CreditLimit();

  types: AccountType[] = [];
  companyName = environment.defaults.companyName;

  sepaCodes: any = [];

  grades: Grade[] = [];
  units: Unit[] = [];
  sic: SIC[] = [];
  categories: CustomerCategory[] = [];

  ratings:any=[];

  allIndustry: Industry[] = [];

   @Input()
   sameSite: any = {sameSite: false};

   @Input()
   sameTip: any = {sameTip: false};

  @Input()
  isSimpleOrder: boolean = false;

   incumbentList: any = [];
   accountIncumbents: any = [];
   currentIncumbent = -1;
   newIncumbent: AccountIncumbents = new AccountIncumbents();

   environment = environment;

   isStandaloneSite: boolean = false;


  constructor(private accountService: AccountService,
    private router: Router,
    private containerService: ContainerService,
    private industryService: IndustryService,
    private accountStateService: AccountStateService,
    private incumbentService:IncumbentService,
    private modalService: ModalService,
    private contactService:ContactService,
    private contractService:ContractService,
    private orderService: OrderService) { }

  ngOnInit(): void {
    this.accountService.getAccountTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Account types could not be loaded");
      return e;
    }))
    .subscribe((types: AccountType[]) => {
      this.types = types.filter(t => ['Customer', 'Prospect', 'Supplier', 'Depot', 'Tip', 'Non credit account', 'Site'].indexOf(t.name) !== -1);
    });

    this.accountService.getSepaCodes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("Sepa Codes could not be loaded");
      return e;
    }))
    .subscribe(sepaStuff => {
      this.sepaCodes = sepaStuff;
      this.sepaCodes.unshift({id: -1, name: 'Select a Sepa Code', code: 'N/A'});
    });

    this.industryService.getAll()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("industry could not be loaded");
      return e;
    }))
    .subscribe((data:any) => {
      this.allIndustry = data;
    });


    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("units could not be loaded");
      return e;
    }))
    .subscribe((units: Unit[]) => {
      this.units = units;
    });

    this.containerService.getAllGrades()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("grades could not be loaded");
      return e;
    }))
    .subscribe((grades: Grade[]) => {
      this.grades = grades;
    });

    this.accountService.getAllCustomerCategories()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert("customer categories could not be loaded");
      return e;
    }))
    .subscribe((data: CustomerCategory[]) => {
      this.categories = data;
    });


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
      this.sic.unshift({code: 'Select a sic code', name: 'from list',id:-1} as any);
    });

    this.accountService.getAccountRatings()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;} alert('Could not retrieve Account Ratings.');return e;}))
    .pipe(take(1))
    .subscribe(ratings => {
      this.ratings = ratings;
    })

    this.incumbentService.getAllIncumbents()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;} alert('Could not retrieve Incumbents.');return e;}))
    .pipe(take(1))
    .subscribe(incumbents => {
      this.incumbentList = incumbents;
    })

    this.accountStateService.$tippingPriceAdded.subscribe((price: TippingPrice) => {
      this.tippingPrices.tippingPrices.push(price);
    })
  }

  ngOnChanges(changes: SimpleChanges){

    // Set sites account id
    if(changes.account) {
      this.loadIncumbents()
    }
  }

  createOrder() {
    this.router.navigateByUrl('orders/new/accounts/' + this.account.id + '/sites');
  }

  checkAccount(v,r){
    if(r.accountId === -1 || r.accountId === null){
      return 'No Account Set';
    } else {
      return r.account.name;
    }
  }

  onCompanySelected($event) {
    this.account.name = $event.company_name;
    this.account.notes = $event.description;
    this.account.billingAddress1 = $event.address.premises + ' ' + $event.address.address_line_1;
    this.account.billingCity = $event.address.locality;
    this.account.billingCountry = $event.address.country;
    this.account.billingPostCode = $event.address.postal_code;

    const sic = this.sic.filter(s => s.code === $event.sic_codes[0])[0];

    this.account.sicId = sic.id;
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

  confirmTransfer(){
    this.account.shippingAddress1 = this.account.billingAddress1;
    this.account.shippingAddress2 = this.account.billingAddress2;
    this.account.shippingCity = this.account.billingCity;
    this.account.shippingCountry = this.account.billingCountry;
    this.account.shippingPostCode = this.account.billingPostCode;
  }

  onDeletePriceClick(i: number) {
    const tippingPrice = this.tippingPrices.tippingPrices[i];

    if(tippingPrice.id !== -1) {
      this.accountService.deleteTippingPrices(tippingPrice.id)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Tipping price could not be deleted from backend');
        return e;
      }))
      .subscribe(() => {
        this.tippingPrices.tippingPrices.splice(i, 1);
      })
    } else {
      this.tippingPrices.tippingPrices.splice(i, 1);
    }
  }

  openModal(name: string) {
    this.modalService.open(name);
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

  updateRating(event){
    const id = parseInt(event.target.value,10);

    this.account.rating = new AccountRating();
    this.account.rating_id = id;
    this.account.rating.id = id;
  }

  addIncumbent(event){
    this.currentIncumbent = parseInt(event.target.value,10);

    this.newIncumbent.accountId = this.account.id;
    this.newIncumbent.incumbentId = this.currentIncumbent;
    this.newIncumbent.incumbent.id = this.currentIncumbent;
  }

  loadIncumbents(){
    this.newIncumbent = new AccountIncumbents();
    this.incumbentService.getIncumbentsByAccountId(this.account.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not retrieve Incumbents');
      return e;
    }))
    .subscribe((incumbents) => {
      this.accountIncumbents = incumbents
    })
  }

  saveIncumbent(){
    if(this.newIncumbent.accountId === -1 || this.newIncumbent.incumbent.id === -1){
      alert('Please select an Incumbent');
    } else {
      this.incumbentService.addIncumbent(this.newIncumbent)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Incumbent could not be Saved');
        return e;
      }))
      .subscribe(() => {
        this.loadIncumbents();
      })
    }
  }

  deleteIncumbent(id:number){
    let incumbent = this.accountIncumbents.filter(f=>f.id===id)[0];
    incumbent.active = false;

    this.incumbentService.updateIncumbent(incumbent)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Incumbent could not be deleted');
      return e;
    }))
    .subscribe(() => {
      this.loadIncumbents();
    })
  }

  setRefForProspect() {

    if(this.account.type_id === 8 && environment.defaults.companyName === 'WRC') {
      this.account.accountRef = '';
      const prefix = "Prospect-" + moment().format('MM') + '-' + moment().format('YYYY') + '-';

      this.accountService.getCountForProspectsByMonthAndYear(moment().format('MM'), moment().format('YYYY'))
      .pipe(take(1))
      .pipe(catchError((e) => {
        alert('Could not load count for month and year');
        return e;
      }))
      .subscribe((data:any) => {
        if(this.account.accountRef === '') {
          this.account.accountRef = prefix + data.length + 1;
        }
      })

    }
  }

  checkIfSite($event) {
    if(+$event.target.value === 13) {
      this.isStandaloneSite = true;

      // automatically make it a tip
      this.account.isTip = true;
    }
  }

}
