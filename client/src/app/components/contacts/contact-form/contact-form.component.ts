import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { ContactsService } from '../../../services/contacts.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit
{
  form;
  processing = false;

  constructor(
    public msgService: MessageService,
    public contactService: ContactsService,
    private formBuilder: FormBuilder
  )
  {}

  ngOnInit()
  {
    this.createForm();
  }

  private createForm()
  {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        this.isEmptyString
      ])],
      surname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        this.isEmptyString
      ])],
      desc: ['', Validators.maxLength(100)],
      city: ['', Validators.maxLength(100)]
    });
  }

  /**
   * Validator for checking if the string is empty
   * @param controls
   * @returns { 'emptyString': true }
   */
  private isEmptyString(controls)
  {
    const err = { 'emptyString': true };

    if (controls.value)
    {
      if (controls.value.trim() !== '')
      {
        return null;
      }
      else
      {
        return err;
      }
    }
    else
    {
      return err;
    }
  }

  saveContact()
  {
    this.processing = true;

    const newContact = {
      name: this.form.get('name').value,
      surname: this.form.get('surname').value,
      city: this.form.get('city').value,
      desc: this.form.get('desc').value
    };

    this.contactService.saveNewContact(newContact).subscribe(res => 
    {
      if (!res.success)
      {
        this.processing = false;
        this.msgService.createErrorMessage(res.msg);
      }
      else
      {
        this.msgService.createSuccessMessage(res.msg);
        this.form.reset();
        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 2000);
      }
    });

  }

}
