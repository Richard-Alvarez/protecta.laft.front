import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateClientesGeneralComponent } from './template-clientes-general.component';

describe('TemplateClientesGeneralComponent', () => {
  let component: TemplateClientesGeneralComponent;
  let fixture: ComponentFixture<TemplateClientesGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateClientesGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateClientesGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
