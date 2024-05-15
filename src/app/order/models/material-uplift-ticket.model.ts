import { Job } from "src/app/timeline-skip/models/job.model";
import { Account } from "./account.model";
import { Unit } from "./unit.model";

export class MaterialUpliftTicket {
    id: number = -1;
    
    accountId: number = -1;
    account: Account = new Account();
    
    jobId: number = -1;
    job: Job = new Job();
    
    unitId: number = -1;
    unit: Unit = new Unit();
    
    price: number = 0;
    qty: number = 1;
    name: string = '';
    signedOff: boolean = false;
    deleted: boolean = false;
    ticketNumber: string = ''
    supplierInvoiceNumber: string = '';
    
    createdBy: number = -1;
    
    createdAt: string = '';
    updatedAt: string = '';
      
}