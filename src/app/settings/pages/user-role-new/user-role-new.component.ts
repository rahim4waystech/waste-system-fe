import { Component, OnInit } from '@angular/core';
import { UserGroup } from 'src/app/auth/models/user-group.model';
import { UserRoleValidatorService } from '../../validators/user-role.validator.service';
import { UserService } from 'src/app/user/services/user.service';
import { take, catchError } from 'rxjs/operators';
import { Permission } from '../../models/permission.model';
import { UserGroupPermission } from '../../models/user-group-permission.model';

@Component({
  selector: 'app-user-role-new',
  templateUrl: './user-role-new.component.html',
  styleUrls: ['./user-role-new.component.scss']
})
export class UserRoleNewComponent implements OnInit {

  userGroup: UserGroup = new UserGroup();

  isError: boolean = false;
  isServerError: boolean = false;

  userGroupPermissions = {permissions: []};

  constructor(private userRoleValidator: UserRoleValidatorService,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.userRoleValidator.isValid(this.userGroup)) {
      // try to save it
      this.userService.createUserGroup(this.userGroup)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data: UserGroup) => {

        if(this.userGroupPermissions.permissions.length === 0) {
          // move to edit mode
         window.location.href = '/settings/roles';
        } else {
          this.createUserGroupPermissions(data.id);
        }
      })
    } else {
      this.isError = true;
    }
  }

  createUserGroupPermissions(userGroupId: number=-1) {
    const userGroupPermissions = [];

    this.userGroupPermissions.permissions.forEach((permission: Permission) => {
      const userGroupPermission = new UserGroupPermission();
      userGroupPermission.permissionId = permission.id;
      userGroupPermission.userGroupId = userGroupId;

      userGroupPermissions.push(userGroupPermission);
    })

    this.userService.bulkCreateUserGroupPermissions(userGroupPermissions)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not save permissions for user group')
      return e;
    }))
    .subscribe((data) => {
      window.location.href = '/settings/roles';
    })
  }


}
