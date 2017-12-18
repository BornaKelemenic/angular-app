import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../../../models/Contact';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit
{
  @Input() contact: Contact;


  constructor(
    public contactService: ContactsService
  )
  {}

  ngOnInit()
  {
    if (!this.contact)
    {
      this.contact = {
        _id: null,
        name: 'Error',
        surname: 'Error',
        city: 'Error',
        addedBy: null,
        desc: 'Error',
        picture: null,
        mobile_numbers: null
      };
    }
  }

}
