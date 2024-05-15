import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersArticComponent } from './orders-artic.component';

describe('OrdersArticComponent', () => {
  let component: OrdersArticComponent;
  let fixture: ComponentFixture<OrdersArticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersArticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersArticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
