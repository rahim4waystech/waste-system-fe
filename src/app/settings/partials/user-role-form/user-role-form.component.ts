import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserGroup } from 'src/app/auth/models/user-group.model';
import { Permission } from '../../models/permission.model';
import { UserService } from 'src/app/user/services/user.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-user-role-form',
  templateUrl: './user-role-form.component.html',
  styleUrls: ['./user-role-form.component.scss']
})
export class UserRoleFormComponent implements OnInit, OnChanges {

  @Input()
  userGroup: UserGroup = new UserGroup();

  permissions: Permission[] = [];

  @Input()
  userGroupPermissions = {permissions: {}};

  dropdownSettings: any = {};
  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 20,
      allowSearchFilter: true
    };

    this.userService.getAllPermissionsInSystem()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load permissions');
      return e;
    }))
    .subscribe((permissions: Permission[]) => {
      this.permissions = permissions;
    })
  }

 ngOnChanges(simple: SimpleChanges) {
 }

}
