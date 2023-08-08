import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoductComponent } from './poduct.component';

describe('PoductComponent', () => {
  let component: PoductComponent;
  let fixture: ComponentFixture<PoductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoductComponent]
    });
    fixture = TestBed.createComponent(PoductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
