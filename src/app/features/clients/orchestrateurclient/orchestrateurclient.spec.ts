import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orchestrateurclient } from './orchestrateurclient';

describe('Orchestrateurclient', () => {
  let component: Orchestrateurclient;
  let fixture: ComponentFixture<Orchestrateurclient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orchestrateurclient],
    }).compileComponents();

    fixture = TestBed.createComponent(Orchestrateurclient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
