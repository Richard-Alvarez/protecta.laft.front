import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoContraparteComponent } from './historico-contraparte.component';

describe('HistoricoContraparteComponent', () => {
  let component: HistoricoContraparteComponent;
  let fixture: ComponentFixture<HistoricoContraparteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoContraparteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoContraparteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
