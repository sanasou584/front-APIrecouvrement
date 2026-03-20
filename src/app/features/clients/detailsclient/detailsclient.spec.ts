import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detailsclient } from './detailsclient';

describe('Detailsclient', () => {
  let component: Detailsclient;
  let fixture: ComponentFixture<Detailsclient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detailsclient],
    }).compileComponents();

    fixture = TestBed.createComponent(Detailsclient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
