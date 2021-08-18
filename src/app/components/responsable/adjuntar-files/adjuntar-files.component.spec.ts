import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjuntarFilesComponent } from './adjuntar-files.component';

describe('AdjuntarFilesComponent', () => {
  let component: AdjuntarFilesComponent;
  let fixture: ComponentFixture<AdjuntarFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjuntarFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjuntarFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
