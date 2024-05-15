import { Component, Input, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { DriverJobMovement } from 'src/app/pods/models/driver-job-movement.model';
import { PodService } from 'src/app/pods/services/pod.service';

@Component({
  selector: 'app-skip-resolve-issue',
  templateUrl: './skip-resolve-issue.component.html',
  styleUrls: ['./skip-resolve-issue.component.scss']
})
export class SkipResolveIssueComponent implements OnInit {

  @Input()
  currentPod: DriverJobMovement = new DriverJobMovement();
  constructor(private podService: PodService,
    private modalService: ModalService) { }

  ngOnInit(): void {

  }

  save() {
    this.currentPod.tipIssueResolved = true;

    this.podService.updatePOD(this.currentPod)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update job');
      return e;
    }))
    .subscribe((pod) => {
      this.cancel();
    })
  }

  cancel() {
    // this.reset();
    this.modalService.close('skipResolveIssueModal');
  }

}
