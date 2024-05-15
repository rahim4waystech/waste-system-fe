import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/models/user.model';
import { UserValidatorService } from '../../validators/user-validator.service';
import { UserService } from 'src/app/user/services/user.service';
import { take, catchError } from 'rxjs/operators';
import { UserSkill } from '../../models/user-skill.model';
import { OrderService } from 'src/app/order/services/order.service';
import { OrderType } from 'src/app/order/models/order-type.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-new',
  templateUrl: './users-new.component.html',
  styleUrls: ['./users-new.component.scss']
})
export class UsersNewComponent implements OnInit {


  user: User = new User();

  isError: boolean = false;
  isServerError: boolean = false;

  userSkills: UserSkill[] = [];

  constructor(private userValidator: UserValidatorService,
    private orderService: OrderService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.orderService.getAllOrderTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load order types');
      return e;
    }))
    .subscribe((types: OrderType[]) => {
        environment.timelineOptions.forEach((option) => {
          const userSkill = new UserSkill();
          userSkill.isPrimary = false;
          userSkill.orderTypeId = +option.value;
          userSkill.orderType = types.filter(t => t.id === option.value)[0];
          this.userSkills.push(userSkill);
        });
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.userValidator.isValid(this.user)) {
      // try to save it
      this.userService.createUser(this.user)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((user: User) => {

        // this.userSkills.forEach((skill) => {
        //   skill.userId = user.id;
        // });

        // this.saveUserSkills();
        window.location.href = '/settings/users';
      })
    } else {
      this.isError = true;
    }
  }

  saveUserSkills() {
    this.userService.createBulkUserSkills(this.userSkills.filter(us => us.active))
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not create user skills');
      return e;
    }))
    .subscribe(() => {
      window.location.href = '/settings/users';
    })
  }


}
