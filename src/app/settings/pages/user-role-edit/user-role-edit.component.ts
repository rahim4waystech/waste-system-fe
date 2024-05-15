import { Component, OnInit } from '@angular/core';
import { UserGroup } from 'src/app/auth/models/user-group.model';
import { ActivatedRoute } from '@angular/router';
import { UserRoleValidatorService } from '../../validators/user-role.validator.service';
import { UserService } from 'src/app/user/services/user.service';
import { take, catchError } from 'rxjs/operators';
import { UserGroupPermission } from '../../models/user-group-permission.model';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'app-user-role-edit',
  templateUrl: './user-role-edit.component.html',
  styleUrls: ['./user-role-edit.component.scss']
})
export class UserRoleEditComponent implements OnInit {

  group: UserGroup = new UserGroup();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  userGroupPermissions = {permissions: []};


  constructor(private route: ActivatedRoute,
    private userRoleValidator: UserRoleValidatorService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadUserGroup(+params['id']);
    })
  }

  loadUserGroup(id: number): void {
    this.userService.getUserGroupById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((group: UserGroup) => {
      this.group = group;
      this.loadUserGroupPermissions(group.id);
    })
  }

  loadUserGroupPermissions(userGroupId:number=-1) {
    this.userService.getAllUserGroupPermissionsForUserGroup(userGroupId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((permissions: UserGroupPermission[]) => {
      const newPermissions = [];
      permissions.forEach((permission: any) => {
        newPermissions.push(permission.permission);
      })

      this.userGroupPermissions.permissions = newPermissions;

    })
  }

  deleteAll() {
    this.userService.deleteAllPermissionForUserGroup(this.group.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not delete existing permissions');
      return e;
    }))
    .subscribe(() => {
      this.createUserGroupPermissions(this.group.id);
    })
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



  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.userRoleValidator.isValid(this.group)) {
      // try to save it
      this.userService.updateUserGroup(this.group)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        if(this.userGroupPermissions.permissions.length === 0) {
          window.location.href = '/settings/roles';
        } else {
          this.deleteAll();
        }
      })
    } else {
      this.isError = true;
    }
  }

}
