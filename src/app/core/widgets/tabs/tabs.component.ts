import { TabComponent } from './tab/tab.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    tabs: TabComponent[] = [];

    @Input()
    inverse: boolean = false;
    @Output() tabClicked: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  selectTab(tab: TabComponent) {

    this.tabs.forEach((tabItem) => {
      tabItem.active = false;
    });
    tab.active = true;

    this.tabClicked.next(tab);
  }



  addTab(tab: TabComponent) {
    if (this.tabs.length === 0) {
      tab.active = true;
    }
    this.tabs.push(tab);

  }

}
