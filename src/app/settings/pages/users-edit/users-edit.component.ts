import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { UserValidatorService } from '../../validators/user-validator.service';
import { UserService } from 'src/app/user/services/user.service';
import { take, catchError } from 'rxjs/operators';
import { UserSkill } from '../../models/user-skill.model';
import { environment } from 'src/environments/environment';
import { OrderService } from 'src/app/order/services/order.service';
import { OrderType } from 'src/app/order/models/order-type.model';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit {

  user: User = new User();
  skills: UserSkill[] = [];
  types: OrderType[] = [];

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private userValidator: UserValidatorService,
    private orderService: OrderService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadUser(+params['id']);
    })
  }

  loadUser(id: number): void {
    this.userService.getUserById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((user: User) => {
      user.password = '';
      this.user = user;

      this.loadOrderTypes();
    })
  }

  loadOrderTypes() {
    this.orderService.getAllOrderTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load order types');
      return e;
    }))
    .subscribe((types: any) => {
      this.types = types;

      this.loadUserSkills(this.user.id);
    })
  }

  loadUserSkills(id: number) {
    this.userService.getAllSkillsForUser(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load skills for user');
      return e;
    }))
    .subscribe((skills: UserSkill[]) => {
      this.skills = skills;

      this.skills.forEach((skill) => {
        skill.active = true;
      })

      environment.timelineOptions.forEach((option) => {
        const found = this.skills.filter(s => s.orderTypeId === +option.value)[0];

        if(!found) {
          this.skills.push({
            active: false,
            isPrimary: false,
            userId: this.user.id,
            orderTypeId: +option.value,
          } as UserSkill);
        }
      })

      this.skills.forEach((skill) => {
        skill.orderType = this.types.filter(t => t.id === skill.orderTypeId)[0];
      })
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.userValidator.isValid(this.user)) {
      // try to save it
      this.userService.updateUser(this.user)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        // move to edit mode
        this.isSuccess = true;
      })
    } else {
      this.isError = true;
    }
  }

  // saveUserSkills() {

  //   this.skills.forEach((skill: UserSkill) => {
  //     delete skill.id; 
  //   })
  //   this.userService.createBulkUserSkills(this.skills.filter(us => us.active))
  //   .pipe(take(1))
  //   .pipe(catchError((e) => {
  //     alert('could not create user skills');
  //     return e;
  //   }))
  //   .subscribe(() => {
  //     this.isSuccess = true;
  //   })
  // }


  // deleteUserSkills() {
  //   this.userService.deleteAllSkillsForUser(this.user.id)
  //   .pipe(take(1))
  //   .pipe(catchError((e) => {
  //     alert('could not delete user skills');
  //     return e;
  //   }))
  //   .subscribe(() => {
  //     this.saveUserSkills();
  //   })
  // }


}
