import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ContactsService
{
  options;

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
}
