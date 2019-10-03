import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreetSectionEditComponent } from './street-section-edit.component';

describe('StreetSectionEditComponent', () => {
  let component: StreetSectionEditComponent;
  let fixture: ComponentFixture<StreetSectionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreetSectionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreetSectionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
