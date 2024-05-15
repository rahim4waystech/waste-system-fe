import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-job-signoff-land-edit-job',
  templateUrl: './job-signoff-land-edit-job.component.html',
  styleUrls: ['./job-signoff-land-edit-job.component.scss']
})
export class JobSignoffLandEditJobComponent implements OnInit {


@Input()
mode: string = 'manager';
  constructor() { }

  ngOnInit(): void {
  }

}
