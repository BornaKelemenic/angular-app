import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { BlogComponent } from './components/blog/blog.component';
import { BlogService } from './services/blog.service';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { MessageService } from './services/message.service';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserListItemComponent } from './components/user/user-list-item/user-list-item.component';
import { UserRoleGuard } from './guards/user-role.guard';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { ContactsTableComponent } from './components/contacts/contacts-table/contacts-table.component';
import { ContactsService } from './services/contacts.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent,
    DeleteBlogComponent,
    PublicProfileComponent,
    UserListComponent,
    UserListItemComponent,
    UserEditComponent,
    ContactsTableComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, BlogService, MessageService, UserRoleGuard, ContactsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
