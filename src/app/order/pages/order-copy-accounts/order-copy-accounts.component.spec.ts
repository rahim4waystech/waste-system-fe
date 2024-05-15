import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCopyAccountsComponent } from './order-copy-accounts.component';

describe('OrderCopyAccountsComponent', () => {
  let component: OrderCopyAccountsComponent;
  let fixture: ComponentFixture<OrderCopyAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCopyAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCopyAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
