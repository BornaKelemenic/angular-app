import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-delete-blog',
  templateUrl: './delete-blog.component.html',
  styleUrls: ['./delete-blog.component.css']
})
export class DeleteBlogComponent implements OnInit
{
  foundBlog = false;
  processing = false;

  blog;

  constructor(
    private router: Router, 
    private blogService: BlogService,
    private activated_route: ActivatedRoute,
    public msgService: MessageService
  )
  {}

  ngOnInit()
  {
    this.blogService.getBlogById(this.activated_route.snapshot.params.id).subscribe(res => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
      }
      else
      {
        this.blog = res.blog;
        this.foundBlog = true;
      }
    });
  }

  // If pressed YES delete blogs
  deleteBlog()
  {
    this.processing = true;
    this.blogService.deleteBlog(this.activated_route.snapshot.params.id).subscribe(res => 
    {
      if (!res.success)
      {
        this.msgService.createErrorMessage(res.msg);
      }
      else
      {
        this.msgService.createSuccessMessage(res.msg);

        setTimeout(() => {
          this.router.navigate(['/blogs']);
        }, 1000);
      }
    });
  }

  // If pressed NO navigate back to blogs
  goBack()
  {
    this.router.navigate(['/blogs']);
  }
}
