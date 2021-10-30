import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ForderungEditComponent } from './forderung-edit.component';

describe('ForderungEditComponent', () => {
  let component: ForderungEditComponent;
  let fixture: ComponentFixture<ForderungEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForderungEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForderungEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
