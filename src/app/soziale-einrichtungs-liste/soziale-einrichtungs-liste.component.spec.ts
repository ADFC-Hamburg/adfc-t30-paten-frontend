import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SozialeEinrichtungsListeComponent } from './soziale-einrichtungs-liste.component';

describe('SozialeEinrichtungsListeComponent', () => {
  let component: SozialeEinrichtungsListeComponent;
  let fixture: ComponentFixture<SozialeEinrichtungsListeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SozialeEinrichtungsListeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SozialeEinrichtungsListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
