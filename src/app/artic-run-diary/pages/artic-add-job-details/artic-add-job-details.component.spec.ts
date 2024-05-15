import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticAddJobDetailsComponent } from './artic-add-job-details.component';

describe('ArticAddJobDetailsComponent', () => {
  let component: ArticAddJobDetailsComponent;
  let fixture: ComponentFixture<ArticAddJobDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticAddJobDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticAddJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
