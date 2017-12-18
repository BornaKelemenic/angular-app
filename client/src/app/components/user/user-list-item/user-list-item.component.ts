import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../models/User';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
export class UserListItemComponent implements OnInit 
{
  @Input() user: User;

  showHide = false;

  constructor() { }

  ngOnInit() {
  }

  showHideEdit()
  {
    this.showHide = !this.showHide;
  }

}
