import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticAddJobComponent } from './artic-add-job.component';

describe('ArticAddJobComponent', () => {
  let component: ArticAddJobComponent;
  let fixture: ComponentFixture<ArticAddJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticAddJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticAddJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
