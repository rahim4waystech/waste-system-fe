import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '../../models/contract.model';
import { Account } from 'src/app/order/models/account.model';
import { ContractService } from '../../service/contract.service';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'src/app/account/services/account.service';
import { take, catchError } from 'rxjs/operators';
import { ContractValidatorService } from '../../validators/contract-validator.service';
import { ContractProduct } from '../../models/contract-product.model';

@Component({
  selector: 'app-contract-new',
  templateUrl: './contract-new.component.html',
  styleUrls: ['./contract-new.component.scss']
})
export class ContractNewComponent implements OnInit {

  @Input()
  contract: Contract = new Contract();

  @Input()
  contractProducts: any = {contractProducts: []};

  customer: any = {};

  

  isError: boolean = false;
  isServerError: boolean = false;
  constructor(private contractService: ContractService,
    private accountService: AccountService,
    private contractValidatorService: ContractValidatorService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadAccount(+params['id']);
    })
  }

  loadAccount(id: number) {
    this.accountService.getAccountById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load account for contract');
      return e;
    }))
    .subscribe((account: Account) => {
      this.customer = account;
      this.contract.accountId = this.customer.id;
      this.contract.account = {id: this.customer.id} as any;
    })

  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.contractValidatorService.isValid(this.contract)) {
      // try to save it
      this.contractService.createContract(this.contract)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((contract: Contract) => {
        this.contract.id = contract.id;
        if(this.contractProducts.contractProducts.length === 0) {
          // move to edit mode
          window.location.href = '/contracts';
        } else {
          this.saveContractProducts();
        }
      })
    } else {
      this.isError = true;
    }
  }

  saveContractProducts() {
    this.contractProducts.contractProducts.forEach((product: ContractProduct) => {
      product.contractId = this.contract.id;
    });
    this.contractService.createBulkContractProducts(this.contractProducts.contractProducts)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not save contract products');
      return e;
    }))
    .subscribe(() => {
      window.location.href = '/contracts';
    })
  }

}
