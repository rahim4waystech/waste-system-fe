import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticTimelineTransportAddAssignmentNoteComponent } from './artic-timeline-transport-add-assignment-note.component';

describe('TimelineTransportAddAssignmentNoteComponent', () => {
  let component: ArticTimelineTransportAddAssignmentNoteComponent;
  let fixture: ComponentFixture<ArticTimelineTransportAddAssignmentNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticTimelineTransportAddAssignmentNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticTimelineTransportAddAssignmentNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
