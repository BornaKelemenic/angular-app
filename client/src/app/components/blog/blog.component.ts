import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit 
{
  newPost = false;
  loadingBlogs = false;
  form: FormGroup;
  processing = false;
  newBlogValid = false;
  username: string;

  blogs;

  constructor(
    private formBuilder: FormBuilder,
    public authService: AuthService,
    private blogService: BlogService,
    public msgService: MessageService
  ) 
  {
    this.createNewBlogForm();
  }

  ngOnInit() 
  {
    this.authService.getProfile().subscribe(profile => 
    {
      this.username = profile.user.username;
    });

    this.getAllBlogs();    
  }

  // Get all blogs via BlogService
  private getAllBlogs()
  {
    this.blogService.getBlogs().subscribe(res =>
      {
        if (!res.success)
        {
          this.msgService.createErrorMessage(res.msg);
        }
        else
        {
          this.msgService.removeInfoMessages();
          this.blogs = res.blogs;
          this.blogs.reverse();
        }
      });
  }

  /**
   * Initialize new blog form
   */ 
  createNewBlogForm()
  {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ])],

      text: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ])]
    });
  }

  enableNewBlogForm()
  {
    this.form.get('title').enable();
    this.form.get('text').enable();
  }

  disableNewBlogForm()
  {
    this.form.get('title').disable();
    this.form.get('text').disable();
  }

  // Disable submit button if the Title and Text are an empty string
  checkValidityOfNewBlog(event)
  {
    if (event.target.value)
    {
      const value = event.target.value.trim();
      if (value.length > 0)
      {
        this.newBlogValid = true;
      }
      else
      {
        this.newBlogValid = false;
      }
    } 
    else 
    {
      this.newBlogValid = false;
    }
  }

  // Submit new blog function
  onBlogSubmit()
  {
    this.processing = true;
    this.disableNewBlogForm();

    const blog = {
      title: this.form.get('title').value,
      text: this.form.get('text').value,
      author: this.username
    };

    this.blogService.newBlog(blog).subscribe(res => 
    {
      if (!res.success) 
      {
        this.msgService.createErrorMessage(res.msg);
        this.processing = false;
        this.enableNewBlogForm();
      } 
      else 
      {
        this.msgService.createSuccessMessage(res.msg);

        setTimeout(() => {
          this.processing = false;
          this.enableNewBlogForm();
          this.msgService.removeInfoMessages();
          this.goBack();
        }, 2000);
      }
    });

  }

  newBlogForm()
  {
    this.newPost = true;
  }
  goBack()
  {
    this.newPost = false;
    this.form.reset();
    this.reloadBlogs();
  }

  reloadBlogs()
  {
    this.loadingBlogs = true;
    this.getAllBlogs();

    setTimeout(() => 
    {
      this.loadingBlogs = false;
    }, 4000);
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
        this.getAllBlogs();
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
        this.getAllBlogs();
      }
    });
  }

  draftComment()
  {
    
  }

}
