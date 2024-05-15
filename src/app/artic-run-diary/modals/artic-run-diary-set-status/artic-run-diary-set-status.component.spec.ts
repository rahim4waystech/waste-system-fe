import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticRunDiarySetStatusComponent } from './artic-run-diary-set-status.component';

describe('ArticRunDiarySetStatusComponent', () => {
  let component: ArticRunDiarySetStatusComponent;
  let fixture: ComponentFixture<ArticRunDiarySetStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticRunDiarySetStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticRunDiarySetStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
