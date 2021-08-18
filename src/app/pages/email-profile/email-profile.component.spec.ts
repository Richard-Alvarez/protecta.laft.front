import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailProfileComponent } from './email-profile.component';

describe('EmailProfileComponent', () => {
  let component: EmailProfileComponent;
  let fixture: ComponentFixture<EmailProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
