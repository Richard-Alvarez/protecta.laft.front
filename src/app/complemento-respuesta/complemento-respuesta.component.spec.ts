import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementoRespuestaComponent } from './complemento-respuesta.component';

describe('ComplementoRespuestaComponent', () => {
  let component: ComplementoRespuestaComponent;
  let fixture: ComponentFixture<ComplementoRespuestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplementoRespuestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplementoRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
