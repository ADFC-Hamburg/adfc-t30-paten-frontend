import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SozialeEinrichtungViewComponent } from './soziale-einrichtung-view.component';

describe('SozialeEinrichtungViewComponent', () => {
  let component: SozialeEinrichtungViewComponent;
  let fixture: ComponentFixture<SozialeEinrichtungViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SozialeEinrichtungViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SozialeEinrichtungViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
