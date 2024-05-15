import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { GridColumn } from '../../models/grid-column.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { RequestQueryBuilder, QuerySortOperator, CondOperator, QueryJoinArr, QueryJoin } from "@nestjsx/crud-request";
import { PaginationService } from '../../services/pagination.service';
import { GridButton } from '../../models/grid-button.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, Event } from '@angular/router';
import { GridFilter } from '../../models/grid-filter.model';
import { GridSearchFilter } from '../../models/grid-search-filter.model';
import { GridSelectedFilter } from '../../models/grid-selected-filter.model';
import { catchError, filter, take } from 'rxjs/operators';
import * as moment from 'moment';
import { ModalService } from '../../services/modal.service';
import { GridStateService } from '../../services/grid-state.service';
import { SavedSearchService } from '../../services/saved-search.service';
import { SavedSearch } from '../../models/saved-search.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  // Provide entity and it will make the API call automatically
  results$: any = null;

  @Input()
  customDataSource: any = null;
  @Input()
  entity: string = '';

  @Input()
  showDatePicker: boolean = false;

  @Input()
  displayDate: any = '';

  @Input()
  columns: GridColumn[] = [];

  @Input()
  filters: GridFilter[] = [];

  @Input()
  amount: number = 10;

  @Input()
  buttons: GridButton[] = [];

  @Input()
  searchFields: string[] = [];

  @Input()
  searchFilters: GridSearchFilter[] = [];

  @Input()
  sortColumn: string = 'id';

  @Input()
  sortDirection: string = 'desc';

  @Input()
  radioSelector: boolean = false;

  @Input()
  checkboxSelector: boolean = false;


  @Input()
  defaultRadioValue: number = -1;

  @Input()
  relationships: string[] = [];

  @Input()
  inverse: boolean = false;

  @Input()
  showSearch: boolean = true;

  @Input()
  backgroundSetter: any = null;

  @Input()
  hoverOverTextAction: any = null;

  @Input()
  textColor: string = '#666';

  @Output()
  radioButtonSelected: EventEmitter<any> = new EventEmitter();


  @Output()
  checkboxSelected: EventEmitter<any> = new EventEmitter();


  @Output()
  recordsUpdate: EventEmitter<any> = new EventEmitter();

  search: string = '';

  savedSearches: any = {items:[]};

  newPage: number = 1;

  records: any = [];

  totalRecords: number = 0;

  selectedFilters: GridSelectedFilter[] = [];

  newSearchFilter: GridSelectedFilter = new GridSelectedFilter();

  currentSearchFilterType: string = 'text';

  selectedSavedSearchId: number = -1;

  // Manually create instance so all grids have unique page numbers
  paginationService: PaginationService = new PaginationService();
  simpleSearch:boolean = true;

  yesterdayDate = moment().subtract(1,'d').format('LL');
  tomorrowDate = moment().add(1,'d').format('LL');
  isDatePickerVisible: boolean = false;

  selectedRecords: any = [];

  constructor(private httpClient: HttpClient,
    private modalService: ModalService,
    private gridStateService: GridStateService,
    private domSan: DomSanitizer,
    private savedSearchService: SavedSearchService,
    private router: Router)
     {
      this.paginationService.setPage(1);

      this.newPage = 1;
      this.paginationService.setAmountPerPage(this.amount);
    }


  ngOnInit() {

    const filters = localStorage.getItem('WS_MJL_GRID_' + this.entity);

    const metaData = localStorage.getItem('WS_MJL_GRID_META_' + this.entity);

    const search = localStorage.getItem('WS_MJL_GRIDQUICK_' + this.entity);

    let sort:any = localStorage.getItem('WS_MJL_GRID_SORT_' + this.entity);


    // restore sort order
    if(sort && sort !== '') {
      sort = JSON.parse(sort); 
      this.sortDirection = sort.direction;
      this.sortColumn = sort.column;
    }

    if(search !== '' && search !== null && search !== undefined && this.showSearch) {
      this.search = search;
    }

    if(filters !== '' && filters !== null && filters !== undefined && this.showSearch) {
      this.selectedFilters = JSON.parse(filters);
    }

    if(metaData !== '' && metaData !== null && metaData !== undefined) {
      const metadataObj = JSON.parse(metaData);
      this.newPage = +metadataObj.page;
     // this.paginationService.setPage(+metadataObj.page);
      this.paginationService.setAmountPerPage(+metadataObj.amount);
      this.amount = +metadataObj.amount;
    }

    this.getRecordsForEntity();

    // this.gridStateService.$gridColumnsUpdated.subscribe((columns: any) => {
    //   this.columns = columns;
    //   this.getRecordsForEntity();
    // })

    // this.gridStateService.$gridColumnsUpdated.next(this.columns);
  }


  getRecordsForEntity(): void {

    if(this.results$ !== null) {
      this.results$.unsubscribe();
    }
    if(this.customDataSource !== null) {
       this.customDataSource(this).subscribe((records: any) => {
        this.records = records.data;

        this.recordsUpdate.emit(this.records);
  
  
        this.paginationService.setTotalRecords(records.total);
        this.paginationService.setPaginatedTotal(records.count);
      })
      return;
    }

    if(this.entity === null || this.entity === undefined || this.entity === '') {
      throw new Error('You must provide an entity to use for the grid');
    }


    if(this.savedSearches.items.length === 0) {
      this.savedSearchService.getAllByEntity(this.entity)
      .pipe(take(1))
      .pipe(catchError((e) => {
        // alert('could not load saved searches for this entity');
        return e;
      }))
      .subscribe((data: SavedSearch[]) => {
        this.savedSearches.items = data;
      })
    }

    // build query using nestjs query builder

    const qb: RequestQueryBuilder = RequestQueryBuilder.create();

    const querySortOperator: string = this.sortDirection.toLowerCase() === 'asc' ? "ASC" : "DESC";

    // add cateria for search fields
    const searchFieldsOptions = [];

    if(this.search !== ''){
      this.searchFields.forEach((field: string) => {
        const object = {};
        object[field] = {$cont: this.search};
        searchFieldsOptions.push(object);
      });
    }
    const selectedFilters = {};
    // Add any user selected filters
    this.selectedFilters.forEach((filter: GridSelectedFilter) => {

      let value = filter.value;
      if(this.getSearchFilterType(filter.field) === 'date') {
        value = '"' + moment(value).format('YYYY-MM-DD') + '"';
      }


      selectedFilters[filter.field] = {};
      selectedFilters[filter.field]['$' + filter.condition] = filter.value;
    })

    const filters = [];
    // Add any additional user defined filters to the query
    this.filters.forEach((filter: GridFilter) => {
      if(!selectedFilters[filter.field]) {
        selectedFilters[filter.field] = {};
      }
      selectedFilters[filter.field]['$' +filter.condition] = filter.value;

    });

    if(this.displayDate !== ''){
      const funDate = moment(this.displayDate).format('YYYY-MM-DD');
      qb.setFilter({field:'date', operator: <CondOperator>'eq', value: funDate });
    }


    const searchJSON:any = {
      $and: [
        selectedFilters,{
        "$or": 
        searchFieldsOptions,
        }
      ]
    }
    qb.search(searchJSON);
    qb.setPage(this.paginationService.getPage());
    qb.setLimit(this.amount);

    qb.sortBy({ field: this.sortColumn, order: <QuerySortOperator>querySortOperator })

    localStorage.setItem('WS_MJL_GRID_META_' + this.entity, JSON.stringify({page: this.paginationService.getPage(), amount: this.paginationService.getAmountPerPage()}));
    localStorage.setItem('WS_MJL_GRID_SORT_' + this.entity, JSON.stringify({column: this.sortColumn, direction: this.sortDirection}));

    // Weird way to do this, think maybe a bug in query builder.
    this.relationships.forEach((relation: string) => {
      qb.setJoin(<QueryJoinArr>[relation]);
    })

    this.httpClient.get(environment.api.endpoint + this.entity + '?' + qb.query())
    .pipe(catchError((err) => {
      if(err.status === 403 || err.status === 401) {
        return err;
      }
      // alert('Grid could not pull back records for the provided entity - ' + this.entity);
      return err;
    }))
    .subscribe((records: any) => {
     
      this.records = records.data;

      this.recordsUpdate.emit(this.records);


      this.paginationService.setTotalRecords(records.total);
      this.paginationService.setPaginatedTotal(records.count);
    })
  }
  

  selectAllOptionHandler() {
    this.onPaginationAmountChanged({target: {value: this.getTotalRecords()}});
    this.selectAll({target: {checked: true}});
  }

  getLabelForColumn(column: GridColumn): string {
    if(column.label === null || column.label === undefined || column.label === '') {
      return column.field;
    } else {
      return column.label;
    }
  }

  onGridSavedSearchModalSaved($event) {
    const savedSearch = new SavedSearch();
    savedSearch.name = $event;
    savedSearch.entity = this.entity;
    savedSearch.data = JSON.stringify(this.selectedFilters);
    
    this.savedSearchService.createSavedSearch(savedSearch)
    .pipe(take(1))
    .pipe(catchError((e) => {
      // alert('Could not save current search');
      return e;
    }))
    .subscribe((data) => {
      this.savedSearches.items.push(data);
      alert('Search has been saved')
    })

  }

  getColumnValueForField(column: GridColumn, record: any, raw: boolean = false): any {
    let value: any = null;

    if(column.value !== null && column.value !== undefined && column.value !== '') {

      try {
        if(column.value(record[column.field], record)) {
          value = column.value(record[column.field], record);
        } else {
          value = '';
        }
      }
      catch {
        value = '';
      }
    } else {
      if(column.field.indexOf('.') === -1) {
        value = record[column.field];
      } else {
        const fieldParts = column.field.split('.');

        let buildUpValue = record;

        for(let i = 0; i < fieldParts.length; i++) {

          if(buildUpValue === null) {
            value = "";
          } else {
            buildUpValue = buildUpValue[fieldParts[i]];
          }
        }

        value = buildUpValue;

      }
    }

    if(!value) {
      value = '';
    }

    if(!raw) {
      return this.domSan.bypassSecurityTrustHtml(value);
    } else {
      return value;
    }
  }

  onColumnHeaderClicked(column: GridColumn): void {
    if(this.sortColumn === column.field) {
      if(this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else {
        this.sortDirection = 'asc';
      }
    } else {
      this.sortColumn = column.field;
      this.sortDirection = 'asc';
    }
    // Refresh records
    this.paginationService.setPage(1);
    this.newPage = 1;
    this.getRecordsForEntity();
  }

  loadSearch() {

    if(this.selectedSavedSearchId === -1) {
      alert('Please select a valid search to load');
      return;
    }

    const searchItem = this.savedSearches.items.filter(s => s.id === this.selectedSavedSearchId)[0];

    if(searchItem) {
      this.selectedFilters = JSON.parse(searchItem.data);
      this.getRecordsForEntity();
      alert('Saved search has been loaded');
    }
  }

  saveSearch() {
    this.modalService.open('gridSavedSearchModal');
  }


  getHoverText(record: any) {
    if(this.hoverOverTextAction) {
      return this.hoverOverTextAction(record);
    } else {
      return '';
    }
  }

  getColumnSortMarker(column: GridColumn): string  {
    let marker: string = '';

    if(column.field === this.sortColumn) {
      marker = this.sortDirection === 'asc' ? '▲' : '▼';
     }

    return marker;
  }

  getActiveColumns() {
    return this.columns.filter(c => c.active);
  }

  getPagesArray(): number[] {
    const totalPages: number = this.paginationService.getTotalPages();

    const pagesArray: number[] = [];

    for(let i = 1; i <= totalPages; i++) {
      pagesArray.push(i);
    }

    return pagesArray;
  }

  getCurrentPage(): number {
    return this.paginationService.getPage();
  }

  getTotalRecords(): number {
    return this.paginationService.getTotalRecords();
  }

  getTotalPages(): number {
    return this.paginationService.getTotalPages();
  }

  getOffsetStart(): number {
    return this.paginationService.getOffsetStart();
  }

  getOffsetEnd(): number {
    return this.paginationService.getOffsetEnd();
  }

  isNextActive(): boolean {
    return this.paginationService.isNextActive();
  }

  isPrevActive(): boolean {
    return this.paginationService.isPrevActive();
  }

  onPaginationPageClicked(page: number) {

    if(<any>this.newPage === "") {
      return;
    }

    if(page > this.paginationService.getTotalPages() || page <= 0) {
      // alert('You must supply a valid page number');
      this.newPage = this.paginationService.getPage();
      return;
    }

    this.paginationService.setPage(page);
    this.newPage = page;
    this.getRecordsForEntity();
  }

  onPaginationAmountChanged($event): void {
    this.paginationService.setAmountPerPage(parseInt($event.target.value, 10));
    this.amount = this.paginationService.getAmountPerPage();
    this.paginationService.setPage(1);
    this.newPage = 1;
    this.getRecordsForEntity();
  }

  getButtonContent(button: GridButton): SafeHtml {
    return this.domSan.bypassSecurityTrustHtml(button.label);
  }

  getButtonClass(button: GridButton): SafeHtml {
    let buttonClass = 'btn ';
    buttonClass += this.domSan.bypassSecurityTrustHtml(button.type);
    return buttonClass;
  }

  buttonClicked(button: GridButton, record: any): void {
    if(button.link !== null && button.link !== '' && button.link !== undefined) {
      this.router.navigated = false;
      this.router.navigate([button.link.replace(':id', record.id)]);
    } else {
      button.action(button, record);
    }
  }

  isButtonDisabled(button: GridButton, record: any) {
    if(button.disable !== null && button.disable !== undefined) {
      return button.disable(button, record);
    }

    return false;
  }


  isButtonVisible(button: GridButton, record: any) {
    if(button.trigger !== null && button.trigger !== undefined) {
      return button.trigger(record, button);
    }

    return true;
  }

  onSearchKeyUp($event): void {
    localStorage.setItem('WS_MJL_GRIDQUICK_' + this.entity, this.search);
    this.newPage = 1;
    this.paginationService.setPage(1);
    this.getRecordsForEntity();
  }


  addSelectedFilter($event): void {
    if(this.newSearchFilter.condition === "-1"
    || this.newSearchFilter.value === ''
    || this.newSearchFilter.condition === ''
    || this.newSearchFilter.field === "-1") {
      // alert('Please select a valid search filter, value and condition');
      return;
    }

    this.selectedFilters.push(this.newSearchFilter);
    this.newSearchFilter = new GridSelectedFilter();
    this.newSearchFilter.condition = "-1";
    this.newSearchFilter.field = "-1";
    this.currentSearchFilterType = 'text';
    this.paginationService.setPage(1);
    this.newPage = 1;
    this.getRecordsForEntity();

    // Add filters to LC
    localStorage.setItem('WS_MJL_GRID_' + this.entity, JSON.stringify(this.selectedFilters));
  }



  onConditionSelected($event: any, record: GridSelectedFilter): void {
    if(record === null) {
      this.newSearchFilter.condition = $event.target.value;
    } else {
      record.condition = $event.target.value;
      localStorage.setItem('WS_MJL_GRID_' + this.entity, JSON.stringify(this.selectedFilters));
      this.getRecordsForEntity();
    }

  }

  onFieldSelected($event: any, record: GridSelectedFilter): void {
    if(record === null) {
      this.newSearchFilter.field = $event.target.value;
          // set filed type
      this.currentSearchFilterType = this.getSearchFilterType($event.target.value);

    } else {
      record.field = $event.target.value;
      localStorage.setItem('WS_MJL_GRID_' + this.entity, JSON.stringify(this.selectedFilters));
      this.getRecordsForEntity();
    }



  }

  onValueChanged() {
    localStorage.setItem('WS_MJL_GRID_' + this.entity, JSON.stringify(this.selectedFilters));
    this.getRecordsForEntity();
  }

  deleteSelectedFilter(i: number): void {
    this.selectedFilters.splice(i, 1);
    this.paginationService.setPage(1);
    this.newPage = 1;
    this.newSearchFilter = new GridSelectedFilter();
    this.newSearchFilter.condition = "-1";
    this.newSearchFilter.field = "-1";
    this.getRecordsForEntity();
    localStorage.setItem('WS_MJL_GRID_' + this.entity, JSON.stringify(this.selectedFilters));
  }

  onRadioClicked(record: any): void {
    this.radioButtonSelected.emit(record);
    this.defaultRadioValue = record.id;
  }

  onCheckboxClicked($event, record: any): void {
    this.checkboxSelected.emit({checked: $event.target.checked, record: record});
    this.selectedRecords.push(record);
  }


  selectAll($event) {

    if($event.target.checked) {
          
    this.records.forEach((record: any) => {
      this.checkboxSelected.emit({checked: true, record: record});
      this.selectedRecords.push(record);
    });
    } else {
          
    this.records.forEach((record: any) => {
      this.checkboxSelected.emit({checked: false, record: record});
    });
    this.selectedRecords = [];
    }

  }

  isChecked(recordId: number) {
    const record:any = this.selectedRecords.filter(sr => sr.id === recordId)[0];

    return !record ? false : true;
  }


  getBackground(record) {
    if(this.backgroundSetter !== null && this.backgroundSetter !== undefined) {
      return this.backgroundSetter(record);
    }
    return '';
  }

  getSearchFilterType(fieldName: string) {
    let type = 'text';


    const field = this.searchFilters.filter(f => f.field === fieldName)[0];

    if(field !== undefined) {
      type = field.type;
    }

    return type;
  }

  exportToCSV() {
    let data = '';

    this.columns.forEach((column) => {
      data += column.label + ',';
    })

    data = data.substring(0, data.length - 1) + "\n";

    this.records.forEach(record => {
      this.columns.forEach((column) => {
        data += '"' + String(this.getColumnValueForField(column, record, true)).replace(/(<([^>]+)>)/gi, "") + '",';
      })


    data = data.substring(0, data.length - 1) + "\n";

    });


    var link =     document.createElement("a");
    link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    link.setAttribute("download", this.entity + ".csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv"


  }

  openModal(modalName: string) {
    this.modalService.open(modalName);
  }

  dateChange(direction:string){
    switch(direction){
      case 'tomorrow':
        this.displayDate = moment(this.displayDate).add(1,'d').toDate();
        this.yesterdayDate = moment(this.displayDate).subtract(1,'d').format('LL');
        this.tomorrowDate = moment(this.displayDate).add(1,'d').format('LL');
        break;
      case 'yesterday':
        this.displayDate = moment(this.displayDate).subtract(1,'d').toDate();
        this.yesterdayDate = moment(this.displayDate).subtract(1,'d').format('LL');
        this.tomorrowDate = moment(this.displayDate).add(1,'d').format('LL');
        break;
    }

    this.getRecordsForEntity();
  }

  onDateSelected($event) {
    this.displayDate = moment($event).toDate();
    this.yesterdayDate = moment(this.displayDate).subtract(1,'d').format('LL');
    this.tomorrowDate = moment(this.displayDate).add(1,'d').format('LL');

    this.getRecordsForEntity();
  }

  getFormatDate(date:any){
    return moment(date).format('LL')
  }

}
