import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaPreviewComponent } from './carga-preview.component';

describe('CargaPreviewComponent', () => {
  let component: CargaPreviewComponent;
  let fixture: ComponentFixture<CargaPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
