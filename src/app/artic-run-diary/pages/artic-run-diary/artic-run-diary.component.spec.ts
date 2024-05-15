import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticRunDiaryComponent } from './artic-run-diary.component';

describe('ArticRunDiaryComponent', () => {
  let component: ArticRunDiaryComponent;
  let fixture: ComponentFixture<ArticRunDiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticRunDiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticRunDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
