import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SozialeEinrichtungsKarteComponent } from './soziale-einrichtungs-karte.component';

describe('SozialeEinrichtungsKarteComponent', () => {
  let component: SozialeEinrichtungsKarteComponent;
  let fixture: ComponentFixture<SozialeEinrichtungsKarteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SozialeEinrichtungsKarteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SozialeEinrichtungsKarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
