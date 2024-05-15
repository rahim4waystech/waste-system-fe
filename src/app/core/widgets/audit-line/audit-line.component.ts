import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import * as moment from 'moment';
import { UserService } from 'src/app/user/services/user.service';
import { take, catchError } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';

@Component({
  selector: 'app-audit-line',
  templateUrl: './audit-line.component.html',
  styleUrls: ['./audit-line.component.scss']
})
export class AuditLineComponent implements OnInit, OnChanges {

  @Input() data: any = {};

  username: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {

  }
  ngOnChanges(simple: SimpleChanges) {
    if(simple.data !== undefined) {
      if(simple.data.currentValue.createdBy > 0) {
        this.userService.getUserById(this.data.createdBy)
        .pipe(take(1))
        .subscribe((user: User) => {
          this.username = user.firstName + ' ' + user.lastName;
        })
      } else {
        this.username = 'System';
      }
    }
  }

  formatDate(date: string): string {
    return moment(date).format('DD/MM/YYYY HH:mm');
  }



}
