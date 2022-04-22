import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActivadEconomicaComponent } from './modal-activad-economica.component';

describe('ModalActivadEconomicaComponent', () => {
  let component: ModalActivadEconomicaComponent;
  let fixture: ComponentFixture<ModalActivadEconomicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalActivadEconomicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalActivadEconomicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
