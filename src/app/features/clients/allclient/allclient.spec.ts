import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allclient } from './allclient';

describe('Allclient', () => {
  let component: Allclient;
  let fixture: ComponentFixture<Allclient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allclient],
    }).compileComponents();

    fixture = TestBed.createComponent(Allclient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
