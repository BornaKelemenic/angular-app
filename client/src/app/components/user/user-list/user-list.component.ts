import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit
{
  users: Array<any>;
  
  constructor(
    public authService: AuthService,
    public msgService: MessageService
  )
  {}

  ngOnInit()
  {
    this.authService.getAllUsers().subscribe(res => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
      }
      else
      {
        this.users = res.users;        
        this.msgService.createSuccessMessage(res.msg);

        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 3000);
      }
    });
  }
}
