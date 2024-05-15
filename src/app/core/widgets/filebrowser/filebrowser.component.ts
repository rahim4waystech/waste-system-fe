import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { FileSystem } from 'src/app/compliance/models/file-system.model';
import { ComplianceStateService } from 'src/app/compliance/service/compliance-state.service';
import { FilesystemService } from 'src/app/compliance/service/filesystem.service';
import { environment } from 'src/environments/environment';
import { DocumentService } from '../../services/document.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-filebrowser',
  templateUrl: './filebrowser.component.html',
  styleUrls: ['./filebrowser.component.scss']
})
export class FilebrowserComponent implements OnInit {
  @Input()
  pageId: number = 1;
  parentFolder: FileSystem = new FileSystem();
  folder: any = {};
  containedFolders: any = [];
  items: any = [];
  image: any = {};

  constructor(
    private filesystemService:FilesystemService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private complianceStateService: ComplianceStateService,
    private modalService:ModalService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if(params['id'] !== undefined){
        this.pageId = +params['id'];
      }

      this.complianceStateService.$closedModal.subscribe(() => {
        this.loadPage(this.pageId);
      });

      this.loadPage(this.pageId);
    })
  }

  loadPage(id:number){
    this.folder = {};
    this.containedFolders = [];
    this.items = [];

    this.filesystemService.getFolderFromId(this.pageId)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Folder');return e;}))
    .pipe(take(1))
    .subscribe((folder:FileSystem) => {
      this.folder = folder[0];

      this.filesystemService.getFolderFromId(this.folder.parentId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Parent');return e;}))
      .pipe(take(1))
      .subscribe((parent:FileSystem) => {
        this.parentFolder = parent[0];
      })

      this.filesystemService.getChildFoldersById(this.pageId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Child Folders');return e;}))
      .pipe(take(1))
      .subscribe((items) => {
        this.containedFolders = items
      })

      this.documentService.getDocumentsByEntityAndEntityId('folder',this.pageId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Folder Contents');return e;}))
      .pipe(take(1))
      .subscribe((items) => {
        this.items = items

        this.items.forEach(item => {
          switch(item.filetype){
            case 'application/pdf':
              item.fileicon = 'fa-file-pdf';
              break;
            case 'image/jpg':
            case 'image/png':
            case 'image/gif':
            case 'image/jpeg':
              item.fileicon = 'fa-file-image';
              break;
            default:
              item.fileicon = 'fa-file';
              break;
          }
        })
      })
    })
  }

  openDocument(document){

    const filetype = document.filetype.split("/");

    if(filetype[0] === 'image'){
      this.documentService.getImageById(document.id)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Image');return e;}))
      .pipe(take(1))
      .subscribe((image:any) => {
        const imageObject = {
          data:image.data,
          filetype:document.filetype
        };
        this.image = imageObject;
        this.modalService.open('viewImageModal');
      })
    // } else if(filetype[1] === 'pdf') {
    //   this.documentService.getPdfById(document.id)
    //   .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve pdf');return e;}))
    //   .pipe(take(1))
    //   .subscribe((image:any) => {
    //     // const imageObject = {
    //     //   data:image.data,
    //     //   filetype:document.filetype
    //     // };
    //     // this.image = imageObject;
    //     // this.modalService.open('viewImageModal');
    //   })
    } else {
      window.open(environment.publicUrl + 'documents/viewdoc/' + document.id, '_blank');
    }
  }
}
