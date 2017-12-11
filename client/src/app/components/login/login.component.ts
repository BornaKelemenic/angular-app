import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit
{
  proccesing = false;
  form: FormGroup;
  previousURL;

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private authGuard: AuthGuard,
    public msgService: MessageService
  ) 
  {
    this.createForm();
  }

  ngOnInit() 
  {
    if (this.authGuard.redirectURL) 
    {
      this.msgService.createErrorMessage('You must be logged in to view that page.');
      this.previousURL = this.authGuard.redirectURL;
      this.authGuard.redirectURL = undefined;
    }
  }

  createForm()
  {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Function for login
  onLoginSubmit()
  {
    this.proccesing = true;
    this.disableForm();

    const user = {
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };

    this.authService.login(user).subscribe((res) => 
    {      
      if (!res.success) // If failed to login
      {
        this.msgService.createErrorMessage(res.msg);
        this.proccesing = false;
        this.enableForm();
      }
      else // Successfull login
      {
        this.msgService.createSuccessMessage(res.msg);
        this.authService.storeUserData(res.token, res.user);

        setTimeout(() => 
        {
          if (this.previousURL) 
          {
            this.router.navigate([this.previousURL]);
          } 
          else 
          {
            this.router.navigate(['/blogs']);
          }
        }, 750);

      }
    });
    
  }


  enableForm() // Enable the user to input data into fields
  {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();    
  }

  disableForm() // Disable the user to input data into fields
  {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }

}
