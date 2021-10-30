import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ForderungViewComponent } from './forderung-view.component';

describe('ForderungViewComponent', () => {
  let component: ForderungViewComponent;
  let fixture: ComponentFixture<ForderungViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForderungViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForderungViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
