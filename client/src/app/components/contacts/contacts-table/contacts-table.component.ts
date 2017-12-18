import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { ContactsService } from '../../../services/contacts.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Contact } from '../../../models/Contact';

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.css']
})
export class ContactsTableComponent implements OnInit
{  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();  

  constructor(
    public msgService: MessageService,
    public contactService: ContactsService
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
          if (this.contactService.selectedContact)
          {
            if (this.contactService.selectedContact._id !== data[0])
            {
              this.rowClick(data);
            }
          }
          else
          {
            this.rowClick(data);
          }
          
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
        this.contactService.contacts = res.contacts;       
        this.dtTrigger.next();

        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 2000);
      }
    });
  }

  /**
   * Convert an array of objects to display just one field
   * @param array 
   */
  getAllNumbers(array)
  {
    if (array.length < 1)
    {
      return undefined;
    }
    else
    {
      return array.map(br => br.number).join(', ');
    }    
  }

  addNewContact()
  {
    this.contactService.isContactFormEnabled = !this.contactService.isContactFormEnabled;
  }

  rowClick(data)
  {
    this.contactService.getContactById(data[0]).subscribe(res => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
      }
      else
      {
        this.msgService.removeInfoMessages();
        this.contactService.selectedContact = res.contact;
      }
    });
  }
}
