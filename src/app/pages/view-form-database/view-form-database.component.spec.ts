import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormDatabaseComponent } from './view-form-database.component';

describe('ViewFormDatabaseComponent', () => {
  let component: ViewFormDatabaseComponent;
  let fixture: ComponentFixture<ViewFormDatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFormDatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFormDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
