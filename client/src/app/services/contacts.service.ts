import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Contact } from '../models/Contact';

@Injectable()
export class ContactsService
{
  options;
  contacts: Array<Contact>;
  selectedContact: Contact;
  isContactFormEnabled = false;

  constructor(private authService: AuthService, private http: Http)
  {}

  /**
   * Gets all contacts that logged in user has saved
   */
  getContacts()
  {
    this.options = this.authService.getAuthHeaders();
    return this.http.get(this.authService.domain + '/contacts/my', this.options).map(res => res.json());
  }

  /**
   * Saves new contact
   * @param contact 
   */
  saveNewContact(contact)
  {
    this.options = this.authService.getAuthHeaders();
    return this.http.post(this.authService.domain + '/contacts/save', contact, this.options).map(res => res.json());
  }

  /**
   * Get the contact by provided id
   * @param id 
   */
  getContactById(id)
  {
    this.options = this.authService.getAuthHeaders();
    return this.http.get(this.authService.domain + '/contacts/' + id, this.options).map(res => res.json());
  }
}
