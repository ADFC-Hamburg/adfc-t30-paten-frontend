import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PasswordChangeTokenComponent } from './password-change-token.component';

describe('PasswordChangeTokenComponent', () => {
  let component: PasswordChangeTokenComponent;
  let fixture: ComponentFixture<PasswordChangeTokenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordChangeTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordChangeTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
