import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerReinforcedComponent } from './view-customer-reinforced.component';

describe('ViewCustomerReinforcedComponent', () => {
  let component: ViewCustomerReinforcedComponent;
  let fixture: ComponentFixture<ViewCustomerReinforcedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomerReinforcedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerReinforcedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
