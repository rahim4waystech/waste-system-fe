import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/auth/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserGroup } from 'src/app/auth/models/user-group.model';
import { Permission } from 'src/app/settings/models/permission.model';
import { UserGroupPermission } from 'src/app/settings/models/user-group-permission.model';
import { UserSkill } from 'src/app/settings/models/user-skill.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }


 /**
  * Get a user from the backend by id
  *
  * @param id number id of user to get
  *
  * @returns Observable<user>
  */
 getUserById(id: number): Observable<User> {

   if(id <= 0 || id === null || id === undefined) {
     throw new Error('UserService: Id must be a valid number');
   }

  return this.httpClient.get(this._endpoint + 'user/' + id).pipe(map((value: any) => {
     return <User>value;
  }));
 }

 /**
  * Get all active users from the backend by id
  *
  *
  * @returns Observable<user>
  */
 getAllActiveUsers(): Observable<User> {

  return this.httpClient.get(this._endpoint + 'user/').pipe(map((value: any) => {
     return <User>value;
  }));
 }


 /**
  * creates a user in the backend based on user object.
  * @param User user object.
  *
  * @returns Observable<User>
  */
 createUser(user: User): Observable<User> {


   if(!user) {
     throw new Error('user service: you must supply a user object for saving');
   }

   delete user.createdAt;
   delete user.updatedAt;

   if(user.id > 0) {
     throw new Error('vehicle service: Cannot create a existing object');
   }

   delete user.id;
   return this.httpClient.post(this._endpoint + 'user',
   JSON.stringify(user),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <User>data;
   }));
 }


 /**
  * updates a user in the backend based on user object.
  * @param User user object.
  *
  * @returns Observable<User>
  */
 updateUser(user: User): Observable<User> {


   if(!user) {
     throw new Error('user service: you must supply a user object for saving');
   }

   delete user.createdAt;
   delete user.updatedAt;

   if(user.password === '') {
    delete user.password;
   }

   delete user['organisationId'];
   delete user['organisation'];

   if(!user.id || user.id === -1) {
     throw new Error('user service: Cannot update an record without id');
   }

   return this.httpClient.put(this._endpoint + 'user/' + user.id,
   JSON.stringify(user),
   {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
     return <User>data;
   }));
 }



 createUserGroup(group: UserGroup): Observable<UserGroup> {


  if(!group) {
    throw new Error('user group service: you must supply a user group object for saving');
  }

  delete group.createdAt;
  delete group.updatedAt;

  if(group.id > 0) {
    throw new Error('user group service: Cannot create a existing object');
  }

  delete group.id;
  return this.httpClient.post(this._endpoint + 'user-group',
  JSON.stringify(group),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <UserGroup>data;
  }));
}

getUserGroupById(id: number): Observable<UserGroup> {

  if(id <= 0 || id === null || id === undefined) {
    throw new Error('UserGroupService: Id must be a valid number');
  }

 return this.httpClient.get(this._endpoint + 'user-group/' + id).pipe(map((value: any) => {
    return <UserGroup>value;
 }));
}


updateUserGroup(group: UserGroup): Observable<UserGroup> {


  if(!group) {
    throw new Error('user group service: you must supply a user group object for saving');
  }

  delete group.createdAt;
  delete group.updatedAt;

  if(!group.id || group.id === -1) {
    throw new Error('user group service: Cannot update an record without id');
  }

  return this.httpClient.put(this._endpoint + 'user-group/' + group.id,
  JSON.stringify(group),
  {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
    return <UserGroup>data;
  }));
}

  getAllUserGroups(): Observable<UserGroup[]> {
    return this.httpClient.get(this._endpoint + 'user-group').pipe(map((data) => {
      return <UserGroup[]>data;
    }));
  }

  getAllPermissionsInSystem(): Observable<Permission[]> {
    return this.httpClient.get(this._endpoint + 'permission').pipe(map((data) => {
      return <Permission[]>data;
    }))
  }

  getAllUserGroupPermissionsForUserGroup(userGroupId: number) {
    return this.httpClient.get(this._endpoint + 'user-group-permission?filter=userGroupId||eq||' + userGroupId + '&join=permission').pipe(map((data) => {
      return <Permission[]>data;
    }))
  }

  bulkCreateUserGroupPermissions(permissions: UserGroupPermission[]) {
    if(!permissions) {
      throw new Error('You must provide a valid permission object in bulkCreateUserGroupPermissions');
    }

    permissions.forEach((permission: UserGroupPermission) => {
      if(permission.id > 0) {
        throw new Error('user service: Cannot create a existing object bulkCreateUserGroupPermissions');
      }

      delete permission.id;
      delete permission.createdAt;
      delete permission.updatedAt;
    })

    return this.httpClient.post(this._endpoint + 'user-group-permission/bulk',
    JSON.stringify({bulk: permissions}),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <UserGroupPermission[]>data;
    }));
  }

  deleteAllPermissionForUserGroup(usergroupId: number) {
    if(!usergroupId || usergroupId === -1) {
      throw new Error('You must supply a valid id in deleteAllPermissionForUserGroup');
    }

    return this.httpClient.delete(this._endpoint + 'user-group-permission/deleteByUserGroup/' + usergroupId);

  }

  getAllSkillsForUser(userId: number=-1) {
    if(!userId || userId === -1) {
      throw new Error('You must supply a valid user id to get skills');
    }

    return this.httpClient.get(this._endpoint + 'user-skill?filter=userId||eq||' + userId);
  }

  deleteAllSkillsForUser(userId: number) {
    if(!userId || userId === -1) {
      throw new Error('You must supply a valid id in deleteAllSkillsForUser');
    }

    return this.httpClient.delete(this._endpoint + 'user-skill/deleteByUser/' + userId);

  }

  createBulkUserSkills(skills: UserSkill[]): Observable<UserSkill[]> {

    if (!skills) {
      throw new Error('You must provide skills for createBulkUserSkills');
    }

    skills.forEach((skill) => {
      if (skill.id > 0) {
        throw new Error('skill cannot be existing record on createBulkUserSkills');
      }

      delete skill.id;
      delete skill.createdAt;
      delete skill.updatedAt;
    })

    return this.httpClient.post(this._endpoint + 'user-skill/bulk', { "bulk": skills }).pipe(map((value: any) => {
      return <UserSkill[]>value;
    }));
  }
}
