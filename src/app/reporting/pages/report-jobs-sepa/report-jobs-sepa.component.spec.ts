import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportJobsSepaComponent } from './report-jobs-sepa.component';

describe('ReportJobsSepaComponent', () => {
  let component: ReportJobsSepaComponent;
  let fixture: ComponentFixture<ReportJobsSepaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportJobsSepaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportJobsSepaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
