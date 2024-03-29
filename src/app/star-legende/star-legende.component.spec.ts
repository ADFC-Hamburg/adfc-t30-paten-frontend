import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StarLegendeComponent } from './star-legende.component';

describe('StarLegendeComponent', () => {
  let component: StarLegendeComponent;
  let fixture: ComponentFixture<StarLegendeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StarLegendeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarLegendeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
