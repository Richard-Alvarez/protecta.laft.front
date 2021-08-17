import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinforcedCustomersComponent } from './reinforced-customers.component';

describe('ReinforcedCustomersComponent', () => {
  let component: ReinforcedCustomersComponent;
  let fixture: ComponentFixture<ReinforcedCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReinforcedCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReinforcedCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
