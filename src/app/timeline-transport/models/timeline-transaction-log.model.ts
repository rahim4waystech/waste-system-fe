export class TimelineTransactionLog {
    id: number = -1;

    type: string = ''; //delete,create,edit
    entity: string = ''; //assignment, job
    entityId: number = -1;
    date: string = '';
    createdBy: number = -1;
    data: string = '';
  
    createdAt: string = '';
    updatedAt: string = '';
}