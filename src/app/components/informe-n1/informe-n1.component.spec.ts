import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeN1Component } from './informe-n1.component';

describe('InformeN1Component', () => {
  let component: InformeN1Component;
  let fixture: ComponentFixture<InformeN1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeN1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeN1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
