import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SozialeEinrichtungEditComponent } from './soziale-einrichtung-edit.component';

describe('SozialeEinrichtungEditComponent', () => {
  let component: SozialeEinrichtungEditComponent;
  let fixture: ComponentFixture<SozialeEinrichtungEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SozialeEinrichtungEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SozialeEinrichtungEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
