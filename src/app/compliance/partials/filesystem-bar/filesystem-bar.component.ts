import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { FileSystem } from '../../models/file-system.model';

@Component({
  selector: 'app-filesystem-bar',
  templateUrl: './filesystem-bar.component.html',
  styleUrls: ['./filesystem-bar.component.scss']
})
export class FilesystemBarComponent implements OnInit {
  @Input()
   currentFolder: FileSystem = new FileSystem();

  // currentFolder: string = '';

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    // this.currentFolder = 'compliance/documents/jan-2021';
  }

  openModal(name: string) {
    this.modalService.open(name);
  }

}
