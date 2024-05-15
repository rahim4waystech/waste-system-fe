import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { FileSystem } from '../../models/file-system.model';
import { ComplianceStateService } from '../../service/compliance-state.service';

@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.scss']
})
export class UploadFileModalComponent implements OnInit {
  @Input()
  currentFolder: FileSystem = new FileSystem();

  constructor(
    private modalService: ModalService,
      private complianceStateService: ComplianceStateService
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.complianceStateService.$closedModal.next();
    this.modalService.close('uploadFileSystemModal');
  }

  save() {
    // do save stuff
    this.cancel();
  }

}
