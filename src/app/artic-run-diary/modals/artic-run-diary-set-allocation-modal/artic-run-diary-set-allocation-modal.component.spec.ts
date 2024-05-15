import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticRunDiarySetAllocationModalComponent } from './artic-run-diary-set-allocation-modal.component';

describe('ArticRunDiarySetAllocationModalComponent', () => {
  let component: ArticRunDiarySetAllocationModalComponent;
  let fixture: ComponentFixture<ArticRunDiarySetAllocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticRunDiarySetAllocationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticRunDiarySetAllocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
