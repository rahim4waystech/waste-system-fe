import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Job } from '../models/job.model';
import { Socket } from 'ngx-socket-io';
import { JobService } from './job.service';

describe('JobService', () => {
  let service: JobService;
  let httpTestingController: any;

  beforeEach(() => {
    const socketStub = () => ({ fromEvent: string => ({ pipe: () => ({}) }) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobService, { provide: Socket, useFactory: socketStub }]
    });
    service = TestBed.inject(JobService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  it('test for get by job by id', () => {

    let job: Job = new Job();
    job.id = 1;

    service.getJobById(1)
    .subscribe((job: Job) => {
      expect(job.id).toBe(1);
    })

    const req = httpTestingController.expectOne('http://blacks.fourways-technology.co.uk:3000/job/1?join=jobAssignment&join=jobAssignment.driver&join=jobAssignment.vehicle&join=jobAssignment.subcontractor&join=jobAssignment.trailer');

    expect(req.request.method).toEqual('GET');

    req.flush(job);
  })

 
});
