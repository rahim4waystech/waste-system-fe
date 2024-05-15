import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticOrderRemoveProvisionComponent } from './artic-order-remove-provision.component';

describe('ArticOrderRemoveProvisionComponent', () => {
  let component: ArticOrderRemoveProvisionComponent;
  let fixture: ComponentFixture<ArticOrderRemoveProvisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticOrderRemoveProvisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticOrderRemoveProvisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
