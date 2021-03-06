import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { ContactsService } from '../../../services/contacts.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Contact } from '../../../models/Contact';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-contacts-table',
  templateUrl: './contacts-table.component.html',
  styleUrls: ['./contacts-table.component.css']
})
export class ContactsTableComponent implements OnInit
{  
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  refreshing = false;

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

  rerender(): void
  {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      this.refreshing = true;
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.getContacts();

      setTimeout(() => {
        this.refreshing = false;
      }, 4000);
    });
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
