import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBuscarRegistroComponent } from './lista-buscar-registro.component';

describe('ListaBuscarRegistroComponent', () => {
  let component: ListaBuscarRegistroComponent;
  let fixture: ComponentFixture<ListaBuscarRegistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaBuscarRegistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaBuscarRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
