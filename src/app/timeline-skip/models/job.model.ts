import { JobAssignment } from './job-assignment.model';
import { JobStatus } from './job-status.model';
import { Order } from 'src/app/order/models/order.model';

export class Job {
  id: number = -1;

  jobAssignment: JobAssignment = new JobAssignment();
  jobAssignmentId: number = -1;

  jobStatus: JobStatus = new JobStatus();
  jobStatusId: number = -1;

  driverJobStatusId: number = -1;

  jobSignOffStatusId: number = -1;

  order: Order = new Order();
  orderId: number = -1;

  containerInId: number = -1;
  containerOutId: number = -1;
  weight: number = 0;
  tareWeight: number = 0;
  notes: string = '';

  weightStatusId: number = 1;

  tipAndReturn: boolean = false;
  blockNumber: number = -1;
  qty: number = 1;
  date: string = '';
  endDate: string = null;
  complianceIssue: boolean = false;
  complianceNotes: string = '';
  time: string = '';
  tippingPriceId: number = -1;
  jobManagerSignOff: boolean = false;
  chargeable: boolean = true;
  shredderDestructionDate: string = null;
  transportSignOffNotes: string = '';
  subcontractorReg: string = '';
  timelineNotes: string = '';
  carriarSignature: string = '';
  carriarSignatureName: string = '';
  tippedSignature: string = '';
  tippedSignatureName: string = '';
  hasOverweight: boolean = true;
  newPrice: number = 0;
  overridePrice: boolean = false;
  collectionOrder = 0;
  weightNotes: string = '';

  createdBy: number = -1;
  updatedBy: number = -1; 
  
  createdAt: string = '';
  updatedAt: string = '';


  /**New Work**/
  collectionDate: string = localStorage.getItem('MJL_TRANSPORT_TIMELINE_DATE');
  collectionDriverId: number=-1;
  collectionVehicleId: number=-1;
  deliveryDriverId:number=-1;
  deliveryVehicleId: number=-1;
}
