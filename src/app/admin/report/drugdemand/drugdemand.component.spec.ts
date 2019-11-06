/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DrugdemandComponent } from './drugdemand.component';

describe('DrugdemandComponent', () => {
  let component: DrugdemandComponent;
  let fixture: ComponentFixture<DrugdemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugdemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugdemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
