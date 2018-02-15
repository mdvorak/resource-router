import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages.component';
import { MessageService } from '../message.service';
import { createClassSpyObj } from '../../lib/src/utils/class-spy.spec';

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;
  let messageService: MessageService;

  beforeEach(async(() => {
    messageService = createClassSpyObj(MessageService);
    messageService.messages = [];

    return TestBed.configureTestingModule({
      declarations: [MessagesComponent],
      providers: [
        {provide: MessageService, useValue: messageService},
      ]
    });
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
