import { User } from 'src/app/auth/models/user.model';

export class Discussion {
  id: number = -1;
  message: string = '';
  entityType: string = '';;
  entityId: number = -1;
  parentId: number = -1;
  createdBy: number = -1;
  user: User = new User();

  createdAt: string = '';
  updatedAt: string = '';
}
