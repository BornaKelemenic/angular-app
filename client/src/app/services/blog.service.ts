import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class BlogService 
{
  options;
  domain = 'http://localhost:8080';

  constructor(private authService: AuthService, private http: Http)
  {}

  createAuthHeaders()
  {
    this.authService.loadToken();

    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authService.authToken
      })
    });
  }

  /**
   * Save a new blog to the database
   * @param blog 
   */
  newBlog(blog)
  {
    this.createAuthHeaders();
    return this.http.post(this.domain + '/blog/newBlog', blog, this.options).map( res => res.json() );
  }

  /**
   * Get all blogs from the database
   */
  getBlogs()
  {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/blog/blogs', this.options).map( res => res.json() );
  }

  /**
   * Get a blog from the databse by its ID
   * @param id 
   */
  getBlogById(id)
  {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/blog/singleBlog/' + id, this.options).map( res => res.json() );
  }

  /**
   * Edit blog
   * @param blog
   */
  editBlog(blog)
  {
    this.createAuthHeaders();
    return this.http.put(this.domain + '/blog/updateBlog', blog, this.options).map( res => res.json() );
  }

  /**
   * Delete blog by id
   * @param id 
   */
  deleteBlog(id)
  {
    this.createAuthHeaders();
    return this.http.delete(this.domain + '/blog/deleteBlog/' + id, this.options).map( res => res.json() );
  }

  /**
   * Like a blog
   * @param id 
   */
  likeBlog(id)
  {
    const blogID = {id: id};
    this.createAuthHeaders();
    return this.http.put(this.domain + '/blog/likeBlog', blogID, this.options).map(res => res.json());
  }

  /**
   * Dislike a blog
   * @param id 
   */
  dislikeBlog(id)
  {
    const blogID = {id: id};
    this.createAuthHeaders();
    return this.http.put(this.domain + '/blog/dislikeBlog', blogID, this.options).map(res => res.json());
  }

  /**
   * Gets all blogs by provided user's username
   * @param username 
   */
  getBlogsByUsername(username)
  {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/blog/userBlogs/' + username, this.options).map(res => res.json());
  }


}
