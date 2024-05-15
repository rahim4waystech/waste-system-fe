import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, catchError } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { PriceListItem } from '../../models/price-list-item.model';
import { PriceListOtherItem } from '../../models/price-list-other-item.model';
import { PriceList } from '../../models/price-list.model';
import { PriceListService } from '../../services/price-list.service';
import { PriceListValidatorService } from '../../validator/price-list.validator.service';

@Component({
  selector: 'app-price-list-edit',
  templateUrl: './price-list-edit.component.html',
  styleUrls: ['./price-list-edit.component.scss']
})
export class PriceListEditComponent implements OnInit {

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;
  priceList: PriceList = new PriceList();
  account: Account = new Account();

  items: any = {items: []};
  otherItems: any = {items: []};

  constructor(private priceListService: PriceListService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private priceListValidatorService: PriceListValidatorService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadPriceList(+params['id']);
    })
  }

  loadPriceList(id: number) {
    this.priceListService.getPriceListById(id)
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load price list');
      return e;
    }))
    .subscribe((priceList: PriceList) => {
      this.priceList = priceList;
      this.loadPriceListItems();
      this.loadOtherPriceListItems();
      this.account = this.priceList.account;
    })
  }

  loadPriceListItems() {
    this.priceListService.getAllItemsByPriceListId(this.priceList.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load price list items');
      return e;
    }))
    .subscribe((items: PriceListItem[]) => {
      this.items.items = items;
    })
  }

  loadOtherPriceListItems() {
    this.priceListService.getAllOtherItemsByPriceListId(this.priceList.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load price list items');
      return e;
    }))
    .subscribe((items: any) => {
      this.otherItems.items = items;
    })
  }

  onSubmit() {
    this.isError = false;
    this.isServerError = false;
    if(!this.priceListValidatorService.isValid(this.priceList)) {
      this.isError = true;
      return;
    }


    this.priceListService.updatePriceList(this.priceList)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((priceList: PriceList) => {
      this.priceList = priceList;
      this.SavePriceListItems(priceList);
    })

  }

  SavePriceListItems(priceList: PriceList) {
    this.items.items.forEach((item: PriceListItem) => {
      item.priceListId = priceList.id;
    });

    this.priceListService.bulkCreateOrUpdatePriceListItems(this.items.items)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = false;
      return e;
    }))
    .subscribe((data) => {
      if(this.otherItems.length === 0) {
        this.router.navigateByUrl('/price-list');
      } else {
        this.SaveOtherPriceListItems(priceList);
      }
    })
  }

  SaveOtherPriceListItems(priceList: PriceList) {
    this.otherItems.items.forEach((item: PriceListOtherItem) => {
      item.priceListId = priceList.id;
    });

    this.priceListService.bulkCreateOrUpdatePriceListOtherItems(this.otherItems.items)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = false;
      return e;
    }))
    .subscribe((data) => {
      this.router.navigateByUrl('/price-list');
    })
  }

}
