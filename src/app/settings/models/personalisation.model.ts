export class Personalisation {
  id: number = -1;

  userId:number = -1;

  // Transport timelines
  timelineOrientationTipper: boolean = true;
  timelineOrientationGrab: boolean = true;
  timelineOrientationConcrete: boolean = true;
  timelineOrientationSweeper: boolean = true;
  timelineOrientationShredder: boolean = true;
  timelineOrientationTanker: boolean = true;

  // Other Timelines
  timelineOrientationSkip: boolean = true;
  timelineOrientationArtic: boolean = true;

  createdAt: string = '';
  updatedAt: string = '';
}
