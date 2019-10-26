import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSnackBarComponent } from './app-snack-bar.component';

describe('AppSnackBarComponent', () => {
  let component: AppSnackBarComponent;
  let fixture: ComponentFixture<AppSnackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSnackBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
