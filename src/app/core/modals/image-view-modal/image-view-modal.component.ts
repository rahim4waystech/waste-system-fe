import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-image-view-modal',
  templateUrl: './image-view-modal.component.html',
  styleUrls: ['./image-view-modal.component.scss']
})
export class ImageViewModalComponent implements OnInit {
  @Input()
  image:any = {};

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  close() {
    this.modalService.close('viewImageModal');
  }

}
