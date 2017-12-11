import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit
{
  form: FormGroup;
  @Input() user;

  constructor(
    public msgService: MessageService,
    private formBuilder: FormBuilder
  )
  {}

  ngOnInit()
  {
    if (this.user === undefined)
    {
      this.user = {
        username: 'Error getting username',
        email: 'Error getting email'
      };
    }
    this.createForm();
  }

  createForm()
  {
    this.form = this.formBuilder.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, Validators.required]
    });
  }

  changeRole(role: string): void
  {
    this.user.role = role;
  }
}
