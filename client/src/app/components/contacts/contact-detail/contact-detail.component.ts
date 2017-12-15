import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit
{
  @Input() contact;


  constructor()
  {}

  ngOnInit()
  {
    if (!this.contact)
    {
      this.contact = {};
    }
  }

}
