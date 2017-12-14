import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.css']
})
export class ContactsTableComponent implements OnInit
{
  contacts;

  constructor(
    public msgService: MessageService,
    private contactService: ContactsService
  )
  {}

  ngOnInit()
  {
    this.contactService.getContacts().subscribe(res => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
      }
      else
      {
        this.msgService.createSuccessMessage(res.msg);
        this.contacts = res.contacts;

        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 2000);
      }
    });
  }
}
