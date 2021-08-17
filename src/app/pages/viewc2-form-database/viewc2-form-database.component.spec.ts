import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewc2FormDatabaseComponent } from './viewc2-form-database.component';

describe('Viewc2FormDatabaseComponent', () => {
  let component: Viewc2FormDatabaseComponent;
  let fixture: ComponentFixture<Viewc2FormDatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Viewc2FormDatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Viewc2FormDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
