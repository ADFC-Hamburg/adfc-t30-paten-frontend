import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForderungEditComponent } from './forderung-edit.component';

describe('ForderungEditComponent', () => {
  let component: ForderungEditComponent;
  let fixture: ComponentFixture<ForderungEditComponent>;

  beforeEach(async(() => {
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
