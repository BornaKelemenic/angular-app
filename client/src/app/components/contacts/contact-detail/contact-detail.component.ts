import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../../models/Contact';
import { ContactsService } from '../../../services/contacts.service';
import { ContactsTableComponent } from '../contacts-table/contacts-table.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit
{
  @Input() contact: Contact;


  constructor(
    public contactService: ContactsService,
    private ctable: ContactsTableComponent
  )
  {}

  ngOnInit()
  {
    if (!this.contact)
    {
      this.contact = {
        name: 'Error',
        surname: 'Error',
        city: 'Error'
      };
    }
  }

  deleteContact()
  {
    swal({
      title: 'Do you really want to delete this contact ?',
      text: 'This will delete your contact for good.',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Yes, delete it.',
      reverseButtons: true
    })
    .then(result => 
    {
      if (result.value)
      {
        this.contactService.deleteContactById(this.contact._id).subscribe(res => 
        {
          if (!res.success)
          {
            swal({title: res.msg, type: 'error'});
          }
          else
          {
            swal({title: res.msg, type: 'success', text: `Successfully deleted ${res.cont.name} ${res.cont.surname}`});
          }
        });

        this.contactService.selectedContact = null;
        this.ctable.rerender();
      }
    });
  }

}
