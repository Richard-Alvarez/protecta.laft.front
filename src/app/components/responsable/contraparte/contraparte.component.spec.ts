import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraparteComponent } from './contraparte.component';

describe('ContraparteComponent', () => {
  let component: ContraparteComponent;
  let fixture: ComponentFixture<ContraparteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContraparteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContraparteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
