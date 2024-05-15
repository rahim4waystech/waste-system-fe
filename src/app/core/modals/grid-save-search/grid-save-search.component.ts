import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SavedSearch } from '../../models/saved-search.model';
import { ModalService } from '../../services/modal.service';
import { SavedSearchService } from '../../services/saved-search.service';

@Component({
  selector: 'app-grid-save-search',
  templateUrl: './grid-save-search.component.html',
  styleUrls: ['./grid-save-search.component.scss']
})
export class GridSaveSearchComponent implements OnInit {


  name: string = '';

  @Output()
  saved: EventEmitter<string> = new EventEmitter();

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {

  }

  save() {
    if(!this.name || this.name === '') {
      alert('You must provide a name for this search');
      return;
    }

    this.saved.next(this.name);
    this.cancel();
  }

  cancel() {
    this.name = "";
    this.modalService.close('gridSavedSearchModal');
  }



}
