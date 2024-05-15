import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Order } from '../../models/order.model';
import { Account } from '../../models/account.model';
import { take, catchError } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { AccountService } from 'src/app/account/services/account.service';
import { ContainerService } from 'src/app/container/services/container.service';
import { ContainerSizeType } from 'src/app/container/models/container-size-type.model';
import { ContainerType } from 'src/app/container/models/container-type.model';
import { Grade } from 'src/app/container/models/grade.model';
import { OrderType } from '../../models/order-type.model';
import { SkipOrderType } from '../../models/skip-order-type.model';
import { QuoteLine } from '../../models/quote-line-model';
import { QuoteService } from 'src/app/quoting/services/quote.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Product } from '../../models/product.model';
import { ProductService } from 'src/app/quoting/services/product.service';
import { QuoteStateService } from 'src/app/quoting/services/quote-state.service';
import { OrderValidatorService } from '../../validators/order-validator.service';
import { Contract } from 'src/app/contract/models/contract.model';
import { ContractService } from 'src/app/contract/service/contract.service';
import { ShredderOrderType } from '../../models/shredder-order-type.model';
import { ContractProduct } from 'src/app/contract/models/contract-product.model';
import { ShreddingMethod } from '../../models/shredding-method.model';

@Component({
  selector: 'app-order-quick-form',
  templateUrl: './order-quick-form.component.html',
  styleUrls: ['./order-quick-form.component.scss']
})
export class OrderQuickFormComponent implements OnInit, OnChanges {

  @Input()
  order: Order = new Order();

  @Input()
  account: Account = new Account();

  @Input()
  site: Account = new Account();

  containerSizes: ContainerSizeType[] = [];
  containerTypes: ContainerType[] = [];
  grades: Grade[] = [];
  tips: Account[] = [];
  skipOrderTypes: SkipOrderType[] = [];
  types: OrderType[] = [];


  @Input()
  fromTime: string = '';

  @Input()
  toTime: string = '';

  timeOption: number = 1;

  @Input()
  quoteLines : any = {quoteLines: [] as QuoteLine[]}

  products: Product[] = [];

  contracts: Contract[] = [];
  shredderTypes: ShredderOrderType[] = [];
  shreddingMethods: ShreddingMethod[] = [];

  constructor(private orderService: OrderService,
    private contractService: ContractService,
    private modalService: ModalService,
    private OrderValidator: OrderValidatorService,
    private quoteService: QuoteService,
    private productService: ProductService,
    private accountService: AccountService,
    private quoteStateService: QuoteStateService,
    private containerService: ContainerService) { }

  ngOnInit(): void {
    this.orderService.getAllOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: OrderType[]) => {
      this.types = types;
    });


    this.orderService.getAllSkipOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: SkipOrderType[]) => {
      this.skipOrderTypes = types;
    });

    this.containerService.getAllContainerSizes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('sizes could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((sizes: ContainerSizeType[]) => {
      this.containerSizes = sizes;
    });

    this.containerService.getAllContainerTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load container types')
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: ContainerType[]) => {
      this.containerTypes = types;
    })

    this.containerService.getAllGrades()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load grades')
      return e;
    }))
    .pipe(take(1))
    .subscribe((grades: Grade[]) => {
      this.grades = grades;
    })

    this.accountService.getAllTips()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load tips')
      return e;
    }))
    .pipe(take(1))
    .subscribe((tips: Account[]) => {
      this.tips = tips;
    })

    this.productService.getAllActiveProducts()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load products');
      return e;
    }))
    .subscribe((data: Product[]) => {
      this.products = data;
    });

    this.orderService.getAllShredderOrderTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('shredder order types could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: ShredderOrderType[]) => {
      this.shredderTypes = types;
    });

    this.quoteStateService.$newQuoteLineAdded
    .subscribe((quoteLine: QuoteLine) => {
      this.quoteLines.quoteLines.push(quoteLine);
    })
  }


  ngOnChanges(changes: SimpleChanges) {
    if(changes.site !== undefined) {
      if(changes.site.currentValue.id !== -1) {

        this.contractService.getAllByAccountId(+this.account.id)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401) {
            return e;
          }
          alert('Could not load contracts');
          return e;
        }))
        .subscribe((contracts: Contract[]) => {
          this.contracts = contracts;
        })
      }
    }
  }


  onTimeOptionClicked($event) {
    this.timeOption = $event.target.value;


    if($event.target.value == '1') {
      this.timeOption === 1;
      this.setTimeBasedOnRange();
    } else {
      this.timeOption === 2;
      this.order.time = $event.target.value;
    }


  }

  copyPOToSite() {
  this.site.poNumber = this.order.poNumber;
  this.accountService.updateAccount(this.site)
  .pipe(take(1))
  .pipe(catchError((e) => {
    if(e.status === 403 || e.status === 401) {
      return e;
    }
    alert('could not copy po to site');
    return e;
  }))
  .subscribe(() => {
    alert('PO copied to site');
  })
}

  setTimeBasedOnRange() {
    this.order.time = this.fromTime + " - " + this.toTime;
  }


  deleteQuoteLine(index: number) {
    // if this is a editing of an quote delete the line in the backend if it's been saved
     if(this.quoteLines.quoteLines[index].id !== -1) {
       this.quoteService.deleteQuoteLineById(this.quoteLines.quoteLines[index].id)
       .pipe(take(1))
       .pipe(catchError((e) => {
               if(e.status === 403 || e.status === 401) {
        return e;
      }
         alert('Quote line could not be deleted. Please try again later.');
         return e;
       }))
       .subscribe(() => {
         this.quoteLines.quoteLines.splice(index, 1);
       })
     } else {
       this.quoteLines.quoteLines.splice(index, 1);
     }

   }


   openModal(name:string) {
    this.modalService.open(name);
   }


   getNetTotal(): number {
    let total = 0;

    this.quoteLines.quoteLines.forEach(quoteLine => {
      if(quoteLine.qty > 0 && quoteLine.newPrice > 0) {
        total += quoteLine.qty * quoteLine.newPrice;
      }
    });


    return total;
  }

  getVatTotal(): number {
    let netTotal = this.getNetTotal();

    return (netTotal * 0.20);
  }

  getTotalPriceForQuoteLine(quoteLine: QuoteLine): number {
    if(!quoteLine) {
      throw new Error('quoteline must be provided in order form for total price');
    }

    return quoteLine.newPrice * quoteLine.qty;
  }

    isTabComplete(tabName: string) {
    const errors = this.OrderValidator.getErrors();

    let isValid = true;

    if(errors.length > 0) {
      errors.forEach((field) => {
        if(field.indexOf(tabName) !== -1) {
          isValid = false;
        }
      })
    }

    return isValid;
  }

    foundContactAddress(event){
    this.order.contactAddressLine1 = event.address1;
    this.order.contactAddressLine2 = event.address2;
    this.order.contactAddressLine3 = event.address3;
    this.order.contactCity = event.city;
    this.order.contactCountry = event.country;
  }

  populateProductsFromContract() {
    const contactId = this.order.contractId;

    this.contractService.getAllContractProducts(this.order.contractId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load products for contracts')
      return e;
    }))
    .subscribe((products: ContractProduct[]) => {
      products.forEach((product: ContractProduct) => {
        const quoteLine = new QuoteLine();
        quoteLine.newPrice = product.price;
        quoteLine.product = product.product;
        quoteLine.qty = product.qty;
        quoteLine.productId = product.product.id;

        this.quoteLines.quoteLines.push(quoteLine);
      });
    })


  }

}
