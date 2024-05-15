import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-fuel',
  templateUrl: './fuel.component.html',
  styleUrls: ['./fuel.component.scss']
})
export class FuelComponent implements OnInit {

  currentDate: string = moment().format('YYYY-MM-DD');
  isError = false;
  isSuccess = false;
  constructor() { }

  ngOnInit(): void {
  }

}
