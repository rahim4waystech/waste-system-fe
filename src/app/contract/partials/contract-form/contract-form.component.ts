import { Component, OnInit, Input } from '@angular/core';
import { Contract } from 'src/app/contract/models/contract.model';
import { Account } from 'src/app/order/models/account.model';
import { ContractType } from '../../models/contract-type.model';
import { ContractStatus } from '../../models/contract-status.model';
import { ContractService } from '../../service/contract.service';
import { ContractProduct } from '../../models/contract-product.model';
import { take, catchError } from 'rxjs/operators';
import { Product } from 'src/app/order/models/product.model';
import { ProductService } from 'src/app/quoting/services/product.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { QuoteStateService } from 'src/app/quoting/services/quote-state.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit {

  @Input()
  contract: Contract = new Contract();

  @Input()
  customer: Account = new Account();

  types: ContractType[] = [];
  status: ContractStatus[] = [];

  @Input()
  contractProducts: any = {contractProducts: []};

  products: Product[] = [];


  constructor(private contractService: ContractService,
    private modalService: ModalService,
    private quoteStateService: QuoteStateService,
    private router:Router,
    private productService: ProductService) { }

  ngOnInit(): void {
    this.contractService.getAllTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load types');
      return e;
    }))
    .subscribe((types: ContractType[]) => {
      this.types = types;
    });

    this.productService.getAllActiveProducts()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load products');
      return e;
    }))
    .subscribe((products: Product[]) => {
      this.products = products;
    })

    this.contractService.getAllStatus()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load status');
      return e;
    }))
    .subscribe((status: ContractStatus[]) => {
      this.status = status;
    });

    this.quoteStateService.$newQuoteLineAdded.subscribe((data:any) => {
      data.price = data.newPrice;
      delete data.newPrice;
      this.contractProducts.contractProducts.push(data);
    });

  }

  openModal(modal: string) {
    this.modalService.open(modal)
  }


  deleteContractProduct(index: number) {
    // if this is a editing of an quote delete the line in the backend if it's been saved
     if(this.contractProducts.contractProducts[index].id !== -1) {
       this.contractService.deleteContractProductById(this.contractProducts.contractProducts[index].id)
       .pipe(take(1))
       .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
        return e;
      }
         alert('contract product could not be deleted. Please try again later.');
         return e;
       }))
       .subscribe(() => {
        this.contractProducts.contractProducts.splice(index, 1);
       })
     } else {
      this.contractProducts.contractProducts.splice(index, 1);
     }

   }



  getNetTotal(): number {
    let total = 0;

    this.contractProducts.contractProducts.forEach(item => {
      if(item.qty > 0 && item.price > 0) {
        total += item.qty * item.price;
      }
    });


    return total;
  }

  getVatTotal(): number {
    let netTotal = this.getNetTotal();

    return (netTotal * 0.20);
  }

  getTotalPriceForProduct(contractProduct: ContractProduct): number {
    if(!contractProduct) {
      throw new Error('contractProduct must be provided in order form for total price');
    }

    return contractProduct.price * contractProduct.qty;
  }

  populateRef() {
    this.contract.contractRef = this.customer.accountRef + '-' + moment().format('MM') + '-' + moment().format('yyyy');
    this.contract.contractRef += '/' + this.contract.contractNumber;
  }

  showAccount(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${"/accounts/edit/" + this.customer.id}`])
    );

    window.open(url, '_blank');
  }

}
