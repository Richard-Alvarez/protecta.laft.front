import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { C2Detailv2Component } from './c2-detailv2.component';

describe('C2Detailv2Component', () => {
  let component: C2Detailv2Component;
  let fixture: ComponentFixture<C2Detailv2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ C2Detailv2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(C2Detailv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
