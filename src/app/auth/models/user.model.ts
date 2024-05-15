import { UserGroup } from './user-group.model';


export class User {
  id: number = -1;

  userGroup: UserGroup = new UserGroup();
  userGroupId: number = -1;

  firstName: string = '';
  middleName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  driverId: number = -1;
  fitterId: number = -1;

  createdAt: string = '';
  updatedAt: string = '';
}
