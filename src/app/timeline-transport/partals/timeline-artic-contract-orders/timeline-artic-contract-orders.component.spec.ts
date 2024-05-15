import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineArticContractOrdersComponent } from './timeline-artic-contract-orders.component';

describe('TimelineArticContractOrdersComponent', () => {
  let component: TimelineArticContractOrdersComponent;
  let fixture: ComponentFixture<TimelineArticContractOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineArticContractOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineArticContractOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
