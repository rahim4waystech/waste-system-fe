import {Component, Input, OnInit} from '@angular/core';
import {Account} from '../../models/account.model';

@Component({
  selector: 'app-order-add-site',
  templateUrl: './order-add-site.component.html',
  styleUrls: ['./order-add-site.component.scss']
})
export class OrderAddSiteComponent implements OnInit {

  constructor() { }

  @Input()
  account = new Account();

  ngOnInit(): void {
  }

}
