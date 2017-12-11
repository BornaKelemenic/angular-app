import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit
{
  currentURL;
  pub_user;
  foundProfile = false;

  constructor(
    private authService: AuthService,
    private activated_route: ActivatedRoute,
    public msgService: MessageService
  )
  {}

  ngOnInit()
  {
    this.currentURL = this.activated_route.snapshot.params;
    this.authService.getPublicProfile(this.currentURL.username).subscribe(res => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
      }
      else
      {        
        this.pub_user = {
          username: res.user.username,
          email: res.user.email
        };
        this.foundProfile = true;
        this.msgService.createSuccessMessage(res.msg);

        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 2000);
      }
    });
  }

}
