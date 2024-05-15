import { Component, Input, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { FileSystem } from '../../models/file-system.model';
import { ComplianceStateService } from '../../service/compliance-state.service';
import { FilesystemService } from '../../service/filesystem.service';

@Component({
  selector: 'app-new-folder-modal',
  templateUrl: './new-folder-modal.component.html',
  styleUrls: ['./new-folder-modal.component.scss']
})
export class NewFolderModalComponent implements OnInit {
  @Input()
  currentFolder: FileSystem = new FileSystem();

  folder: FileSystem = new FileSystem();


  constructor(
    private modalService: ModalService,
    private filesystemService: FilesystemService,
    private complianceStateService: ComplianceStateService
  ) { }

  ngOnInit(): void {
  }

  cancel() {
    this.modalService.close('newFolderModal');
  }

  save() {

    if(this.folder.folderName !== ''){
      if(this.currentFolder.id > 0){
        this.folder.parentId = this.currentFolder.id;
      }
      this.filesystemService.addFolder(this.folder)
      .pipe(take(1))
      .pipe(catchError((e) => {
        return e;
      }))
      .subscribe(() => {
        this.complianceStateService.$closedModal.next();
        this.cancel();
      })
    }
  }

}
