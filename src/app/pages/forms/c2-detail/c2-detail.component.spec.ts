import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C2DetailComponent } from './c2-detail.component';

describe('C2DetailComponent', () => {
  let component: C2DetailComponent;
  let fixture: ComponentFixture<C2DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C2DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C2DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
