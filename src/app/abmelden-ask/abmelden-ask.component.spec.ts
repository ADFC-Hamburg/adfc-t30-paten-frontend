import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbmeldenAskComponent } from './abmelden-ask.component';

describe('AbmeldenAskComponent', () => {
  let component: AbmeldenAskComponent;
  let fixture: ComponentFixture<AbmeldenAskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AbmeldenAskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbmeldenAskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
