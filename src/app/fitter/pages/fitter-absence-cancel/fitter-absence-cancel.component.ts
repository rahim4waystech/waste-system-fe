import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FitterAbsenceService } from '../../services/fitter-absence.service';

@Component({
  selector: 'app-fitter-absence-cancel',
  templateUrl: './fitter-absence-cancel.component.html',
  styleUrls: ['./fitter-absence-cancel.component.scss']
})
export class FitterAbsenceCancelComponent implements OnInit {

  constructor(private fitterAbsenceService: FitterAbsenceService,
    private router: Router,
    private route: ActivatedRoute) { }

  id: number = -1;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
    })
  }

  onCancelClicked() {
    this.fitterAbsenceService.deleteFitterAbsence(this.id).subscribe(() => {
      //assume all good and redirect.
      this.router.navigateByUrl('/4workshop/fitters/absence');
    })
  }

}
