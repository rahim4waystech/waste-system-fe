import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  @Input() type: string = 'generic';
  @Input() entityId: number = -1;
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter();


  filename: string = '';
  file: any = null;
  isSelected: boolean = false;
  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {

  }

  clickInput() {
    document.getElementById('upload').click();
  }

  onFileInputChange($event) {
    this.filename = $event.target.files[0].name;
    this.file = $event.target.files[0];
    this.isSelected = true;
  }

  uploadFile() {
    var file = this.file;
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      let data = {
        mimeType: this.file.type,
        originalFilename: this.file.name,
        fileData: btoa(reader.result as any)
      }

      this.uploadService.uploadFile(data, this.type, this.entityId)
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not upload file please try again later.')
        return e;
      }))
      .subscribe((data) => {
        alert('File has been uploaded');
        this.fileUploaded.next(data);
      })
    };
    reader.onerror = function() {
    };



  }
}
