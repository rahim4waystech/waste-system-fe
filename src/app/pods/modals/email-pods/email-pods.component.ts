import { Component, OnInit, Input } from '@angular/core';
import { PodService } from '../../services/pod.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { take, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-email-pods',
  templateUrl: './email-pods.component.html',
  styleUrls: ['./email-pods.component.scss']
})
export class EmailPodsComponent implements OnInit {

  @Input()
  selectedPods: any = {pods: []};
  message: string = `Hi,
Please see attached your request invoices

Thanks,
Accounts department`;
  email: string = '';
  constructor(private modalService: ModalService,
    private podService: PodService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.modalService.close('emailPODModal');
  }

  send() {
    if(this.email === '' || this.message === '') {
      alert('You must supply a valid email and message');
      return;
    }

    const podsIds = [];

    this.selectedPods.pods.forEach((pod) => {
      podsIds.push(pod.id);
    })

    this.podService.emailPod(podsIds, this.email, this.message)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not email PODs. Please try again later');
      return e;
    }))
    .subscribe(() => {
      window.location.reload();
    })

  }
}
