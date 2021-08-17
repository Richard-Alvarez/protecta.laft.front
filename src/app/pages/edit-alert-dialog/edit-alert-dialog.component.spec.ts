import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAlertDialogComponent } from './edit-alert-dialog.component';

describe('EditAlertDialogComponent', () => {
  let component: EditAlertDialogComponent;
  let fixture: ComponentFixture<EditAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
