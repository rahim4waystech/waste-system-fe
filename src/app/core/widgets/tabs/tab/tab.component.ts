import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { TabsComponent } from '../tabs.component';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @Input() title = '';
  @Input() active = false;
  @Input() invalid = false;

  constructor(tabs: TabsComponent) {
    tabs.addTab(this);
   }

  ngOnInit() {
  }

}
