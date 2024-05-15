import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { DriverJobMovement } from '../../models/driver-job-movement.model';
import { PodService } from '../../services/pod.service';

@Component({
  selector: 'app-delete-pod',
  templateUrl: './delete-pod.component.html',
  styleUrls: ['./delete-pod.component.scss']
})
export class DeletePodComponent implements OnInit {

  pod: DriverJobMovement = new DriverJobMovement();
  constructor(private podService: PodService,
    private router: Router,
    private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadPOD(+params['id']);
    })
  }

  loadPOD(id: number) {
    this.podService.getPODById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not get pod by id');
      return e;
    }))
    .subscribe((pod: DriverJobMovement) => {
      this.pod = pod;
    })
  }
  onCancelClicked() {
    this.pod.active = false;
    this.podService.updatePOD(this.pod)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update pod');
      return e;
    }))
    .subscribe(() => {
      this.router.navigateByUrl('/pods');
    })

  }

}
