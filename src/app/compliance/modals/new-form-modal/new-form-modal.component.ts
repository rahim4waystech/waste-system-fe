import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { FileSystem } from '../../models/file-system.model';

@Component({
  selector: 'app-new-form-modal',
  templateUrl: './new-form-modal.component.html',
  styleUrls: ['./new-form-modal.component.scss']
})
export class NewFormModalComponent implements OnInit {
  @Input()
  currentFolder: FileSystem = new FileSystem();

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }

  cancel() {
    this.modalService.close('newFormModal');
  }

  save() {
    // do save stuff
    this.cancel();
  }

}
