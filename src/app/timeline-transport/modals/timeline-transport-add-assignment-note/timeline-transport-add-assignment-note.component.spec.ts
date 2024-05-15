import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineTransportAddAssignmentNoteComponent } from './timeline-transport-add-assignment-note.component';

describe('TimelineTransportAddAssignmentNoteComponent', () => {
  let component: TimelineTransportAddAssignmentNoteComponent;
  let fixture: ComponentFixture<TimelineTransportAddAssignmentNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineTransportAddAssignmentNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineTransportAddAssignmentNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
