import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { User } from '../models/User';

@Injectable()
export class AuthService 
{
  domain = 'http://localhost:8080';
  authToken;
  user: User;
  options;

  constructor(private http: Http) 
  {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  createAuthHeaders()
  {
    this.loadToken();

    this.options = new RequestOptions({
      headers: new Headers({
        'Content-type': 'application/json',
        'authorization': this.authToken
      })
    });
  }

  /**
   * Returns options for headers
   */
  getAuthHeaders()
  {
    this.createAuthHeaders();
    return this.options;
  }

  loadToken()
  {
    this.authToken = localStorage.getItem('token');
  }

  registerUser(user: User) // Send user object to the server
  {
    return this.http.post(this.domain + '/auth/register', user).map( (res) => res.json() );
  }

  checkEmail(email) // Send email to server to check availability
  {
    return this.http.get(this.domain + '/auth/checkEmail/' + email).map( (res) => res.json() );
  }

  checkUsername(username) // Send username to server to check availability
  {
    return this.http.get(this.domain + '/auth/checkUsername/' + username).map( (res) => res.json() );
  }

  login(user: User) // Login user
  {
    return this.http.post(this.domain + '/auth/login', user).map( (res) => res.json() );
  }

  logout() // Log out
  {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  storeUserData(token, user: User) // Save token and user to browser storage
  {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    this.authToken = token;
    this.user = user;
  }

  // Get user's profile data
  getProfile()
  {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/auth/profile', this.options).map( (res) => res.json() );
  }

  isLoggedIn() // Check if user is logged in
  {
    return tokenNotExpired();
  }

  getPublicProfile(username)
  {
    return this.http.get(this.domain + '/auth/publicProfile/' + username).map(res => res.json());
  }

  /**
   * Get all users
   */
  getAllUsers()
  {
    this.createAuthHeaders();
    return this.http.get(this.domain + '/auth/all-users', this.options).map(res => res.json());
  }

}
