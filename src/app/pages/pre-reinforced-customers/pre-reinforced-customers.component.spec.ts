import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreReinforcedCustomersComponent } from './pre-reinforced-customers.component';

describe('PreReinforcedCustomersComponent', () => {
  let component: PreReinforcedCustomersComponent;
  let fixture: ComponentFixture<PreReinforcedCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreReinforcedCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreReinforcedCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
