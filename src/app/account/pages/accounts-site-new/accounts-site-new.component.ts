import { Component, Input, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AccountValidatorService } from '../../validators/account-validator.service';
import { Account } from 'src/app/order/models/account.model';
import { take, catchError } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderStateService } from 'src/app/order/services/order-state.service';
import { OrderService } from 'src/app/order/services/order.service';
import { ModalService} from '../../../core/services/modal.service';


@Component({
  selector: 'app-accounts-site-new',
  templateUrl: './accounts-site-new.component.html',
  styleUrls: ['./accounts-site-new.component.scss']
})
export class AccountsSiteNewComponent implements OnInit {


  account: Account = new Account();

  isError: boolean = false;
  isServerError: boolean = false;

  @Input()
  parentId: number = -1;

  @Input()
  isPopup: boolean = false;

  @Input()
  isSimpleOrder: boolean = false;

  constructor(private accountValidatorService: AccountValidatorService,
              private route: ActivatedRoute,
              private router: Router,
              private accountService: AccountService,
              private orderStateService: OrderStateService,
              private orderService: OrderService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.parentId = +params['id'];
        // Set account type to site
        this.account.type.id = 13;
        this.account.type_id = 13;
        this.account.isTip = true;
    })

  }

  onSubmit() {


    this.isError = false;
    this.isServerError = false;

    if(this.parentId === -1) {
      // Something went wrong can't find original account
      this.isServerError = true;
      return;
    }


    // set parent id to original account id
    this.account.parentId = this.parentId;

    if (this.accountValidatorService.isValid(this.account)) {
      // try to save it
      this.accountService.createAccount(this.account)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((account: Account) => {
        // move to edit mode
        if (this.isPopup && !this.isSimpleOrder) {
          window.location.reload();
        } else if (this.isSimpleOrder){
          // do state for simple order here
          this.orderStateService.siteAdded$.next(JSON.parse(JSON.stringify(account)));
          this.modalService.close('addSimpleNewSiteOrderModal');
        } else {
          window.location.href = '/accounts/edit/' + this.parentId;
        }
      });
    } else {
      this.isError = true;
    }
  }

  cancel() {
    if (this.isPopup && !this.isSimpleOrder) {
      window.location.reload();
    } else if (this.isSimpleOrder){
        this.modalService.close('addSimpleNewSiteOrderModal');
    } else {
      this.router.navigateByUrl('/accounts');
    }
  }
}
