import { Injectable } from '@angular/core';

@Injectable()
export class MessageService
{
  message: string;
  messageClass: string;

  constructor()
  {}

  /**
   * Create a success colored message
   * @param msg The message to be displayed
   */
  public createSuccessMessage(msg: string)
  {
    this.message = msg;
    this.messageClass = 'alert alert-success';
  }
  /**
   * Create an error colored message
   * @param msg The message to be displayed
   */
  public createErrorMessage(msg: string)
  {
    this.message = msg;
    this.messageClass = 'alert alert-danger';
  }
  /**
   * Set messages to null value so they get hidden
   */
  public removeInfoMessages()
  {
    this.message = null;
    this.messageClass = null;
  }

}
