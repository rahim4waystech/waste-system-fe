import { Component, Input, OnInit } from '@angular/core';
import { DocumentStateService } from '../../services/document-state.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-document-upload-modal',
  templateUrl: './document-upload-modal.component.html',
  styleUrls: ['./document-upload-modal.component.scss']
})
export class DocumentUploadModalComponent implements OnInit {
  @Input()
  vehicleId:number = -1;

  constructor(
    private modalService: ModalService,
    private documentStateService: DocumentStateService
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.documentStateService.$closedModal.next();
    this.modalService.close('documentUploadModal');
  }

}
