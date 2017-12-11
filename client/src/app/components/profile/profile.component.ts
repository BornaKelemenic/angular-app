import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit 
{
  user;
  blogs;
  processing = false;
  showBlogs = false;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    public msgService: MessageService
  ) 
  {}

  ngOnInit() 
  {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    });
  }

  getBlogs(likeDislike?: boolean)
  {
    this.processing = true;

    if (!this.blogs || likeDislike)
    {
      this.blogService.getBlogsByUsername(this.user.username).subscribe(res => 
      {
        if (!res.success)
        {
          this.msgService.createErrorMessage(res.msg);
          this.processing = false;
        }
        else
        {
          this.msgService.removeInfoMessages();
          this.processing = false;
          this.blogs = res.blogs;
          this.showBlogs = true;
        }
      });
    }
    else
    {
      this.showBlogs = true;
      this.processing = false;
    }
  }

  hideBlogs()
  {
    this.showBlogs = false;
  }

  // Like a blog
  likeBlog(id)
  {
    this.blogService.likeBlog(id).subscribe(res => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 3000);
      }
      else
      {
        this.getBlogs(true);
      }
    });
  }

  // Dislike a blog
  dislikeBlog(id)
  {
    this.blogService.dislikeBlog(id).subscribe(res => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
        setTimeout(() => {
          this.msgService.removeInfoMessages();
        }, 3000);
      }
      else
      {
        this.getBlogs(true);
      }
    });
  }

}
