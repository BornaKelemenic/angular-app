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
        Validators.maxLength(100)
      ])],
      surname: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ])],
      desc: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ])],
      city: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100)
      ])]
    });
  }

  saveContact()
  {
    console.log('Saved');
  }

}
