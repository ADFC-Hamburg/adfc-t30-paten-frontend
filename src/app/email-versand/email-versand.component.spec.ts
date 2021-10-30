import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailVersandComponent } from './email-versand.component';

describe('EmailVersandComponent', () => {
  let component: EmailVersandComponent;
  let fixture: ComponentFixture<EmailVersandComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVersandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVersandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
