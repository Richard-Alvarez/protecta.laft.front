import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternationalListMaintenanceComponent } from './international-list-maintenance.component';

describe('InternationalListMaintenanceComponent', () => {
  let component: InternationalListMaintenanceComponent;
  let fixture: ComponentFixture<InternationalListMaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternationalListMaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternationalListMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
