import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-error-fourohfour',
  templateUrl: './error-fourohfour.component.html',
  styleUrls: ['./error-fourohfour.component.scss']
})
export class ErrorFourohfourComponent implements OnInit {

  constructor(private headerService: HeaderService) { }

  ngOnInit(): void {
    this.headerService.visible = true;
  }

}
