import { CorrespondenceType } from "./correspondence-type.model";
import { EmailLog } from './email-log.model';

export class Correspondence {
    id: number = -1;

    correspondenceTypeId: number = -1;
    correspondenceType: CorrespondenceType = new CorrespondenceType();

    emailLogId: number = -1;
    emailLog: EmailLog = new EmailLog();

    calendarId: number = -1;
  
    date: string = '';
    entity: string = '';
    entityId: number = -1;
    subject: string = '';
    description: string = '';
  
    createdBy: number = -1;
    createdAt: string = '';
    updatedAt: string = '';
}