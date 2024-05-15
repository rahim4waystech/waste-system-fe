import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineTransport2Component } from './timeline-transport2.component';

describe('TimelineTransport2Component', () => {
  let component: TimelineTransport2Component;
  let fixture: ComponentFixture<TimelineTransport2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineTransport2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineTransport2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
