import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TokenEingebenComponent } from './token-eingeben.component';

describe('TokenEingebenComponent', () => {
  let component: TokenEingebenComponent;
  let fixture: ComponentFixture<TokenEingebenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TokenEingebenComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenEingebenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
