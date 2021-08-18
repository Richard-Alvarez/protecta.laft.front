import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsDatabaseComponent } from './forms-database.component';

describe('FormsDatabaseComponent', () => {
  let component: FormsDatabaseComponent;
  let fixture: ComponentFixture<FormsDatabaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormsDatabaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
