export class TipTicket {
    id: number = -1;
    jobId: number = -1;
    unitId: number = -1;
    collectionTicketNumber: number = -1;
    qty: number = 0;
    price: number = 0;
    isSignedOff: boolean = false;
    ticketNo: string = '';
    supplierInvoiceNumber: string = '';
    deleted: boolean = false;
    createdBy: number = -1;
    createdAt: string;
    updatedAt: string;
}