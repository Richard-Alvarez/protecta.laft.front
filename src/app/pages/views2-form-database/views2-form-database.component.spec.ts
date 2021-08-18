import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Views2FormDatabaseComponent } from './views2-form-database.component';

describe('Views2FormDatabaseComponent', () => {
  let component: Views2FormDatabaseComponent;
  let fixture: ComponentFixture<Views2FormDatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Views2FormDatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Views2FormDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
