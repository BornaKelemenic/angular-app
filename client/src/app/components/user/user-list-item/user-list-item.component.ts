import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
export class UserListItemComponent implements OnInit 
{
  @Input() user;

  showHide = false;

  constructor() { }

  ngOnInit() {
  }

  showHideEdit()
  {
    this.showHide = !this.showHide;
  }

}
