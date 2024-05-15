import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/auth/models/user.model';
import { UserGroup } from 'src/app/auth/models/user-group.model';
import { UserService } from 'src/app/user/services/user.service';
import { catchError, take } from 'rxjs/operators';
import { DriverService } from 'src/app/driver/services/driver.service';
import { Driver } from 'src/app/driver/models/driver.model';
import { FitterService } from 'src/app/fitter/services/fitter.service';
import { Fitter } from 'src/app/fitter/models/fitter.model';
import { OrderService } from 'src/app/order/services/order.service';
import { OrderType } from 'src/app/order/models/order-type.model';
import { UserSkill } from '../../models/user-skill.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input()
  user: User = new User();

  groups: UserGroup[] = [];
  drivers: Driver[] = [];
  fitters: Fitter[] = [];
  orderTypes: OrderType[] = [];

  @Input()
  userSkills: UserSkill[] = [];

  defaultTimeline: number = -1;
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private driverService: DriverService,
    private fitterService:FitterService
  ) { }

  ngOnInit(): void {
    this.userService.getAllUserGroups()
    .pipe(catchError((e) => {
            if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('groups could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((groups: UserGroup[]) => {
      this.groups = groups;
    });

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
      this.orderTypes = types;
    });

    this.driverService.getAllDrivers()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('drivers could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((drivers: Driver[]) => {
      this.drivers = drivers;
    });

    this.fitterService.getAllFitters()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('fitters could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((fitters: Fitter[]) => {
      this.fitters = fitters;
    });
  }

  getOrderTypeName(orderTypeId: number=-1) {
    const ot = this.orderTypes.filter(ot => ot.id = orderTypeId)[0];
    return ot.name;
  }

  getPrimarySKillId() {
    const primarySkill = this.userSkills.filter(us => us.isPrimary)[0];

    if(!primarySkill) {
      return -1;
    } else {
      return primarySkill.orderTypeId;
    }
  }

  setDefaultTimeline($event) {
    const id = +$event.target.value;
    const userSkill = this.userSkills.filter(us => us.orderTypeId === id)[0];


    this.userSkills.forEach((skill) => {
      skill.isPrimary = false;
    });

    if(userSkill) {
      userSkill.isPrimary = true;
    }
  }

}
