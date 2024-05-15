import { Component, OnInit, Input } from '@angular/core';
import { DriverBonusLevel } from '../../models/driver-bonus-level.model';

@Component({
  selector: 'app-driver-bonus-level-form',
  templateUrl: './driver-bonus-level-form.component.html',
  styleUrls: ['./driver-bonus-level-form.component.scss']
})
export class DriverBonusLevelFormComponent implements OnInit {

  @Input()
  bonusLevel: DriverBonusLevel = new DriverBonusLevel();
  constructor() { }

  ngOnInit(): void {
  }

}
