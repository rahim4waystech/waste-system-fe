import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCustomerModalComponent } from './change-customer-modal.component';

describe('ChangeCustomerModalComponent', () => {
  let component: ChangeCustomerModalComponent;
  let fixture: ComponentFixture<ChangeCustomerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeCustomerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCustomerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
