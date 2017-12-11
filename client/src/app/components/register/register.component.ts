import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit
{
  form: FormGroup;
  proccesing = false;

  emailValid: boolean;
  emailMSG: string;

  usernameValid: boolean;
  usernameMSG: string;

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    public msgService: MessageService
  ) 
  {
    this.createForm();
    this.emailValid = true;
    this.usernameValid = true;
  }

  ngOnInit() 
  {}

  createForm()
  {
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        this.validateEmail
      ])],

      username: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])],

      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8)
      ])],

      confirm: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm') });
  }

  onRegisterSubmit() // Register user
  {
    this.proccesing = true;
    this.disableForm();

    const newUser = {
      email: this.form.get('email').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value
    };

    this.authService.registerUser(newUser).subscribe((response) => {
      if (!response.success)
      {
        this.msgService.createErrorMessage(response.msg);
        this.proccesing = false;
        this.enableForm();
      }
      else
      {
        this.msgService.createSuccessMessage(response.msg + ' Redirecting to login page.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
  }

  // Function to validate e-mail is proper format
  validateEmail(controls) 
  {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) 
    {
      return null; // Return as valid email
    } 
    else 
    {
      return { 'validateEmail': true }; // Return as invalid email
    }
  }

  matchingPasswords(password: string, confirm: string)
  {
    return (group: FormGroup) => {
      if (group.controls[password].value === group.controls[confirm].value)
      {
        return null;
      }
      else
      {
        return { 'matchPassword': true };
      }
    };
  }

  enableForm() // Enable the user to input data into fields
  {
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();    
  }

  disableForm() // Disable the user to input data into fields
  {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable(); 
  }

  checkEmail() // Function for checking if the entered email is available
  {
    if (this.form.controls['email'].value) 
    {
      this.authService.checkEmail(this.form.controls['email'].value).subscribe(res => 
      {
        if (!res.success)
        {
          this.emailValid = false;
          this.emailMSG = res.msg;
        }
        else
        {
          this.emailValid = true;
          this.emailMSG = res.msg;
        }
      });
    }
  }

  checkUsername() // Function for checking if the entered username is available
  {
    if (this.form.controls['username'].value) 
    {
      this.authService.checkUsername(this.form.controls['username'].value).subscribe(res => 
      {
        if (!res.success)
        {
          this.usernameValid = false;
          this.usernameMSG = res.msg;
        }
        else
        {
          this.usernameValid = true;
          this.usernameMSG = res.msg;
        }
      });
    }
  }
}
