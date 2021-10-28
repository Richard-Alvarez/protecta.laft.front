import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerManagerUpdateComponent } from './customer-manager-update.component';

describe('CustomerManagerUpdateComponent', () => {
  let component: CustomerManagerUpdateComponent;
  let fixture: ComponentFixture<CustomerManagerUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerManagerUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerManagerUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
