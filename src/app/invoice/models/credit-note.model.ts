export class CreditNote {
    id: number = -1;

    invoiceId: number = -1;
    invoiceItemId: number = -1;
    jobId: number = -1;

    description: string = '';
    date: string = '';
    value: number = 0;
    deleted: boolean = false;
    emailed: boolean = false;
    emailedDate: string = null;
  
    createdBy: number = -1;
    createdAt: string;
    updatedAt: string;
}