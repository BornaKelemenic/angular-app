import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormGroupDirective, NgForm } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from '../../../models/Contact';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit
{
  form;
  processing = false;
  num_types = ['Mobile', 'Home', 'Work'];

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
      desc: ['', Validators.maxLength(300)],
      city: ['', Validators.maxLength(100)],
      picture: [''],
      mobile_numbers: this.formBuilder.array([ new FormGroup({
        number: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern(/[0-9]/g)
        ])),
        type: new FormControl('', Validators.required),
        desc: new FormControl('')
      })])
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
      desc: this.form.get('desc').value,
      picture: this.form.get('picture').value,
      mobile_numbers: this.form.get('mobile_numbers').value
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
        this.contactService.isContactFormEnabled = false;
        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 2000);
      }
    });

  }

  addNewNumber()
  {
    (<FormArray>this.form.get('mobile_numbers')).push(new FormGroup({
      number: new FormControl(''),
      type: new FormControl(''),
      desc: new FormControl('')
    }));
  }

  removeNumber(num: number)
  {
    (<FormArray>this.form.get('mobile_numbers')).removeAt(num);
  }
}
