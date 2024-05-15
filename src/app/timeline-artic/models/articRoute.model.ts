export class ArticRoute {
  id: number = -1;
  driverId: number = -1;
  driver: string = '';
  vehicleId: number = -1;
  vehicle: string = '';
  trailerId: number = -1;
  trailer: string = '';
  depotId: number = -1;
  startTime: string = '';
  date: string = '';
  expand:boolean = true;
  jobs: any[] = [];

  upcomingInspection:string = '';

  createdAt: string = '';
  updatedAt: string = '';
}
