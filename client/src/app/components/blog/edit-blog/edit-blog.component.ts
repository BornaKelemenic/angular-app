import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit
{
  processing = false;
  currentURL;
  loading = true;
  valuesChanged = false;
  initialValues;

  blog;

  constructor(
    private location: Location,
    private activated_route: ActivatedRoute,
    private blogService: BlogService,
    private router: Router,
    public msgService: MessageService
  )
  {}

  ngOnInit()
  {
    this.msgService.removeInfoMessages();
    this.currentURL = this.activated_route.snapshot.params;
    this.blogService.getBlogById(this.currentURL.id).subscribe((res) => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
      }
      else
      {
        this.blog = res.blog;
        
        this.initialValues = {
          title: res.blog.title,
          text: res.blog.text
        };

        this.loading = false;
      }
    });
  }

  // Function for submitting changes to the blog
  updateBlogSubmit()
  {
    this.processing = true;
    this.blogService.editBlog(this.blog).subscribe(res => 
    {
      if (!res.success)
      {
        this.processing = false;
        this.msgService.createErrorMessage(res.msg);
      } 
      else
      {
        this.msgService.createSuccessMessage(res.msg + ' Redirecting...');
        setTimeout(() => {
          this.location.back();
        }, 1500);
      }
    });
  }

  goBack()
  {
    this.location.back();
  }

  // Check if user changed the values
  onChange()
  {
    if (this.blog.title === this.initialValues.title && this.blog.text === this.initialValues.text)
    {
      this.valuesChanged = false;
    }
    else
    {
      this.valuesChanged = true;
    }
  }
}
