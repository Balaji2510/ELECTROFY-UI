import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aichatbot } from './aichatbot';

describe('Aichatbot', () => {
  let component: Aichatbot;
  let fixture: ComponentFixture<Aichatbot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aichatbot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aichatbot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
