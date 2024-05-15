import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Account } from '../../models/account.model';
import { MaterialUplift } from '../../models/material-uplift.model';
import { Unit } from '../../models/unit.model';
import { OrderStateService } from '../../services/order-state.service';
import { OrderService } from '../../services/order.service';
import { OrderMaterialUpliftValidatorService } from '../../validators/order-material-uplift-validator.service';

@Component({
  selector: 'app-order-material-uplift',
  templateUrl: './order-material-uplift.component.html',
  styleUrls: ['./order-material-uplift.component.scss']
})
export class OrderMaterialUpliftComponent implements OnInit {

  materialUplift: MaterialUplift = new MaterialUplift();
  isError: boolean = false;
  isServerError: boolean = false;
  tips: Account[] = [];
  units: Unit[] = [];
  constructor(private modalService: ModalService,
    private orderService: OrderService,
    private orderMaterialUpliftValidatorService: OrderMaterialUpliftValidatorService,
    private orderStateService: OrderStateService,
    private accountService: AccountService) { }

  ngOnInit(): void {
    this.accountService.getAllAccounts()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load all tips');
      return e;
    }))
    .subscribe((tips: any) => {
      this.tips = tips;
    });

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load units');
      return e;
    }))
    .subscribe((units: any) => {
      this.units =  units;
    })
  }

  onSubmit() { 
    this.isError = false;
    this.isServerError = false;
    
    if(!this.orderMaterialUpliftValidatorService.isDataValid(this.materialUplift)) {
      this.isError = true;
      return;
    }

    this.orderStateService.materialUpliftAdded$.next(this.materialUplift);
    this.cancel();
  }

  cancel() {
    this.materialUplift = new MaterialUplift();
    this.modalService.close('orderMaterialUpliftModal');
  }

  setUnit() {
    this.materialUplift.unit = this.units.filter(u => u.id === this.materialUplift.unitId)[0];
  }

  setAccount() {
    this.materialUplift.account = this.tips.filter(t => t.id === this.materialUplift.accountId)[0];
  }
  

}
