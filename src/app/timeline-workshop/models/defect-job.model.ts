import { DefectStatus } from 'src/app/workshop/models/defect-status.model';

export class DefectJob {
  id: number = -1;

  defectId: number = -1;
  defectAssignmentId: number = -1;
  date: string = '';
  started: string = null;
  ended: string = null;
  blockNumber: number = -1;
  deleted: boolean = false;
  defectStatus: DefectStatus = new DefectStatus();
  defectStatusId:number = 1;
  fitterSignoff: string = '';
  notes: string = '';

  createdAt: string = '';
  updatedAt: string = '';
}
