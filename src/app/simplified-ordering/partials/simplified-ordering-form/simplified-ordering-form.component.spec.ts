import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplifiedOrderingFormComponent } from './simplified-ordering-form.component';

describe('SimplifiedOrderingFormComponent', () => {
  let component: SimplifiedOrderingFormComponent;
  let fixture: ComponentFixture<SimplifiedOrderingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimplifiedOrderingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplifiedOrderingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
