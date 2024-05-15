import { Component, OnInit } from '@angular/core';
import { ShredderMapperService } from '../../services/shredder-mapper.service';
import { AccountService } from 'src/app/account/services/account.service';
import { catchError, take } from 'rxjs/operators';
import { Account } from 'src/app/order/models/account.model';
import { Contact } from 'src/app/contact/models/contact.model';
import { ContactService } from 'src/app/contact/service/contact.service';

@Component({
  selector: 'app-shredder-importer',
  templateUrl: './shredder-importer.component.html',
  styleUrls: ['./shredder-importer.component.scss']
})
export class ShredderImporterComponent implements OnInit {

  constructor(private shredderMapperService: ShredderMapperService,
    private contactService: ContactService,
    private accountService: AccountService) { }

  data: string = "";
  file: any = null;
  stage = 0;

  ngOnInit(): void {
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  uploadDocument() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      this.data = fileReader.result as any;
        const rows = this.data.split("\n");
        // delete labels.
        delete rows[0];


        this.accountService.shredderImport(rows)
        .subscribe((data) => {
          alert('Done now');
        })

    }
    fileReader.readAsText(this.file);
}


  getShredderRecords() {

  }

  run() {
    this.uploadDocument();
  }



}
