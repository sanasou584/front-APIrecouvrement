import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addclient } from './addclient';

describe('Addclient', () => {
  let component: Addclient;
  let fixture: ComponentFixture<Addclient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addclient],
    }).compileComponents();

    fixture = TestBed.createComponent(Addclient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
