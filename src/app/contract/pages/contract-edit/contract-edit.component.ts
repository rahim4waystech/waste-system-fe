import { Component, OnInit } from '@angular/core';
import { Contract } from '../../models/contract.model';
import { ContactValidatorService } from 'src/app/contact/validators/contact-validator.service';
import { ActivatedRoute } from '@angular/router';
import { ContractService } from '../../service/contract.service';
import { ContractValidatorService } from '../../validators/contract-validator.service';
import { take, catchError } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { ContractProduct } from '../../models/contract-product.model';

@Component({
  selector: 'app-contract-edit',
  templateUrl: './contract-edit.component.html',
  styleUrls: ['./contract-edit.component.scss']
})
export class ContractEditComponent implements OnInit {

  contract: Contract = new Contract();
  customer: Account = new Account();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  contractProducts: any = {contractProducts: []};

  constructor(private route: ActivatedRoute,
    private accountService: AccountService,
    private contractService: ContractService,
    private contractValidatorService: ContractValidatorService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadContract(+params['id']);
    })
  }

  loadContractProducts() {
    this.contractService.getAllContractProducts(this.contract.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not get contract products');
      return e;
    }))
    .subscribe((products: ContractProduct[]) => {
      this.contractProducts.contractProducts = products;
    })
  }
  loadContract(id: number): void {
    this.contractService.getContractById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((contract: Contract) => {
      this.contract = contract;
      this.loadAccount(this.contract.accountId);
      this.loadContractProducts();
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
    })

  }

  saveContractProducts() {

    if(this.contractProducts.contractProducts.length > 0){
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

  deleteContractProducts() {
    this.contractService.deleteContractProductById(this.contract.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not delete contract products');
      return e;
    }))
    .subscribe(() => {
      this.saveContractProducts();
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.contractValidatorService.isValid(this.contract)) {
      // try to save it
      this.contractService.updateContract(this.contract)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        if(this.contractProducts.contractProducts.length > 0){
          this.deleteContractProducts();

        } else {
          window.location.href = '/contracts';
        }
      })
    } else {
      this.isError = true;
    }
  }

}
