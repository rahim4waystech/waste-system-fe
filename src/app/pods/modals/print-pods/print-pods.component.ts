import { Component, Input, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { environment } from 'src/environments/environment';
import { PodService } from '../../services/pod.service';

@Component({
  selector: 'app-print-pods',
  templateUrl: './print-pods.component.html',
  styleUrls: ['./print-pods.component.scss']
})
export class PrintPodsComponent implements OnInit {

  @Input()
  selectedPods: any = {pods: []}


  podType: string = 'pod';
  tippedDetails: boolean = false;
  constructor(private modalService: ModalService,
    private podService: PodService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.modalService.close('printPodModal');
  }

  print() {
    this.podService.getBatchPDF(this.selectedPods.pods.map(sp => sp.id), this.podType, this.tippedDetails)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load pods')
      return e;
    }))
    .subscribe((data: any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
      this.cancel();
    
    })
  }

}
