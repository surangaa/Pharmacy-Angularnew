/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LowStockComponent } from './lowStock.component';

describe('LowStockComponent', () => {
  let component: LowStockComponent;
  let fixture: ComponentFixture<LowStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
