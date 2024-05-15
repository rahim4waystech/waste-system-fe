import { Component, OnInit } from '@angular/core';
import { DriverAbsenceService } from '../../services/driver-absence.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-driver-absence-cancel',
  templateUrl: './driver-absence-cancel.component.html',
  styleUrls: ['./driver-absence-cancel.component.scss']
})
export class DriverAbsenceCancelComponent implements OnInit {

  constructor(private driverAbsenceService: DriverAbsenceService,
    private router: Router,
    private route: ActivatedRoute) { }

  id: number = -1;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
    })
  }

  onCancelClicked() {
    this.driverAbsenceService.deleteDriverAbsence(this.id).subscribe(() => {
      //assume all good and redirect.
      this.router.navigateByUrl('/drivers/absence');
    })
  }

}
