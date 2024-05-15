import { Component, OnInit, Input } from '@angular/core';
import { Subcontractor } from '../../models/subcontractor.model';

@Component({
  selector: 'app-subcontractor-depot-from',
  templateUrl: './subcontractor-depot-from.component.html',
  styleUrls: ['./subcontractor-depot-from.component.scss']
})
export class SubcontractorDepotFromComponent implements OnInit {

  @Input() subcontractor: Subcontractor = new Subcontractor();
  constructor() { }

  ngOnInit(): void {
  }

  foundContactAddress(event){
    this.subcontractor.contactAddressLine1 = event.address1;
    this.subcontractor.contactAddressLine2 = event.address2;
    this.subcontractor.contactAddressLine3 = event.address3;
    this.subcontractor.contactCity = event.city;
    this.subcontractor.contactCountry = event.country;
  }

}
