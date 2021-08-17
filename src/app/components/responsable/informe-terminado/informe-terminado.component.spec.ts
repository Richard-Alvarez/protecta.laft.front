import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeTerminadoComponent } from './informe-terminado.component';

describe('InformeTerminadoComponent', () => {
  let component: InformeTerminadoComponent;
  let fixture: ComponentFixture<InformeTerminadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeTerminadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeTerminadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
