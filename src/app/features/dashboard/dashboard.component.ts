import { Component } from '@angular/core';
import { PostsComponent } from '../posts/posts.component';

@Component({
  selector: 'app-dashboard',
  imports: [PostsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent { }
