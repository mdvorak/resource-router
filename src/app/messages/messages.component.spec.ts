import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages.component';
import { MessageService } from '../message.service';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageService: MessageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessagesComponent],
      providers: [
        {
          provide: MessageService,
          useValue: { messages: [] }
        },
      ]
    }).compileComponents();

    messageService = TestBed.inject(MessageService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
