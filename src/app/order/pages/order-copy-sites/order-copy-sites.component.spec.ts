import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCopySitesComponent } from './order-copy-sites.component';

describe('OrderCopySitesComponent', () => {
  let component: OrderCopySitesComponent;
  let fixture: ComponentFixture<OrderCopySitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderCopySitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderCopySitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
