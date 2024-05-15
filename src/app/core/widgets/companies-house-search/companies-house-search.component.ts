import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { CompaniesHouseService } from '../../services/companies-house.service';

@Component({
  selector: 'app-companies-house-search',
  templateUrl: './companies-house-search.component.html',
  styleUrls: ['./companies-house-search.component.scss']
})
export class CompaniesHouseSearchComponent implements OnInit {

  @Input()
  companyName: string = '';

  @Output()
  companySelected: EventEmitter<any> = new EventEmitter();

  
  items: any = {};

  constructor(private companiesHouseService: CompaniesHouseService) { }

  ngOnInit(): void {

  }

  onCompanySelected($event) {
    const number = $event.target.value;

    this.companiesHouseService.getCompanyById(number)
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load companies house record');
      return e;
    }))
    .subscribe((data: any) => {
      const item = this.items.filter(i => i.company_number === number)[0];
      data.description = item.description;
      data.address = item.address;

      this.companySelected.emit(data);
    })
  }

  companiesHouseLookup() {
    this.companiesHouseService.getCompany(this.companyName)
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401){return e;}
      alert('could not load companies house results');
      return e;
    }))
    .subscribe((data: any) => {
      this.items = data.items;
    })
  }



}
