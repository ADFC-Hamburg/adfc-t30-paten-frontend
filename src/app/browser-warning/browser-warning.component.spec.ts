import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrowserWarningComponent } from './browser-warning.component';

describe('BrowserWarningComponent', () => {
  let component: BrowserWarningComponent;
  let fixture: ComponentFixture<BrowserWarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowserWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowserWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
