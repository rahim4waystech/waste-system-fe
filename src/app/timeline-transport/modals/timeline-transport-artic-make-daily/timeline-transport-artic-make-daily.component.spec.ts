import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineTransportArticMakeDailyComponent } from './timeline-transport-artic-make-daily.component';

describe('TimelineTransportArticMakeDailyComponent', () => {
  let component: TimelineTransportArticMakeDailyComponent;
  let fixture: ComponentFixture<TimelineTransportArticMakeDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineTransportArticMakeDailyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineTransportArticMakeDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
