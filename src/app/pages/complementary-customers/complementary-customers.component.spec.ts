import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementaryCustomersComponent } from './complementary-customers.component';

describe('ComplementaryCustomersComponent', () => {
  let component: ComplementaryCustomersComponent;
  let fixture: ComponentFixture<ComplementaryCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplementaryCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplementaryCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
