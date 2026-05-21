import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Orchestrateuruser } from './orchestrateuruser';

describe('Orchestrateuruser', () => {
  let component: Orchestrateuruser;
  let fixture: ComponentFixture<Orchestrateuruser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orchestrateuruser],
    }).compileComponents();

    fixture = TestBed.createComponent(Orchestrateuruser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
