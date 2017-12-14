import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { ContactsService } from '../../../services/contacts.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.css']
})
export class ContactsTableComponent implements OnInit
{
  contacts;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    public msgService: MessageService,
    private contactService: ContactsService
  )
  {}

  ngOnInit()
  {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      rowCallback: (row: Node, data: any[] | Object, index: number) => 
      {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          // Click handler
        });
        return row;
      }
    };

    this.getContacts();
  }

  /**
   * Get all contacts
   */
  private getContacts()
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
        this.dtTrigger.next();

        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 2000);
      }
    });
  }
}
