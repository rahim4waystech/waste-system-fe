import { Component, Input, OnInit } from '@angular/core';
import { take, catchError } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Account } from 'src/app/order/models/account.model';
import { Invoice } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-change-customer-modal',
  templateUrl: './change-customer-modal.component.html',
  styleUrls: ['./change-customer-modal.component.scss']
})
export class ChangeCustomerModalComponent implements OnInit {


  @Input()
  selectedInvoices: any = {invoices: []};


  customerId: number = -1;
  accounts: Account[] = [];
  constructor(private modalService: ModalService,
    private invoiceService: InvoiceService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getAllAccountsForCustomerAndProspect()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load accounts')
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.accounts = accounts;
      this.accounts.unshift({name: 'Select a account', id: -1} as any);
    })
  }

  save() {
    if(this.customerId === -1) {
      alert('You must select a customer from the list');
      return;
    }

    this.selectedInvoices.invoices.forEach((invoice: Invoice) => {
      invoice.account = {id: this.customerId} as any;
      invoice.accountId = this.customerId;
    });

    this.invoiceService.updateBulkInvoices(this.selectedInvoices.invoices)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update invoices')
      return e;
    }))
    .subscribe(() => {
      window.location.reload();
    })

  }

  cancel() {
    this.modalService.close('changeCustomerInvoiceModal');
  }


}
