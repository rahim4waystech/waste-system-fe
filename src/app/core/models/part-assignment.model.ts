import { Part } from 'src/app/workshop/models/part.model';

export class PartAssignment {
  id: number = -1;

  defectId: number = -1;
  vehicleId: number = -1;

  partId: number = -1;
  part: Part = new Part();
  qty: number = 0;

  createdBy: number = -1;
  createdAt: string = '';
  updatedAt: string = '';
}
