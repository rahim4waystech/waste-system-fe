import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimplifiedOrderingNewComponent } from './simplified-ordering-new.component';

describe('SimplifiedOrderingNewComponent', () => {
  let component: SimplifiedOrderingNewComponent;
  let fixture: ComponentFixture<SimplifiedOrderingNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimplifiedOrderingNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimplifiedOrderingNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
