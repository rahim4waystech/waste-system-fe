import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DiscussionService } from '../../services/discussion.service';
import { Discussion } from '../../models/discussion.model';
import { take, catchError } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit, OnChanges {


  @Input()
  entity: string = '';

  @Input()
  data: any = {};

  discussions: Discussion[] = [];

  newDiscussion: Discussion = new Discussion();

  constructor(private discussionService: DiscussionService) { }

  ngOnInit(): void {

  }

  getAgo(createdAt: string) {
    return moment(createdAt).fromNow();
  }


  ngOnChanges(simple: SimpleChanges) {
    if(simple.data !== undefined) {
      if(simple.data.currentValue.id > 0) {

        this.newDiscussion.entityId = this.data.id;
        this.newDiscussion.entityType = this.entity;
        this.newDiscussion.parentId = -1;

        this.discussionService.getDiscussionByEntityNameAndId(this.entity, this.data.id)
        .pipe(take(1))
        .pipe(catchError((e) => {
          if(e.status === 403 || e.status === 401){return e;}
          alert('could not load discussions');
          return e;
        }))
        .subscribe((discussions: Discussion[]) => {
          this.discussions = discussions;
        })

      }
    }
  }

  post() {
    if(this.newDiscussion.message === '') {
      alert('Please supply a message for posting');
      return;
    }

    this.discussionService.createDiscussion(this.newDiscussion)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not create a post');
      return e;
    }))
    .subscribe((discussion: Discussion) => {
      this.discussions.push(discussion);
      this.newDiscussion.message = "";
    })

  }


}
