import { Component, inject, OnInit, signal } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { PostComponent } from '../post/post.component';
import { LoadingPostComponent } from '../../shared/components/loading-post/loading-post.component';

@Component({
  selector: 'app-home',
  imports: [PostComponent, LoadingPostComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private postService = inject(PostService);

  public posts = signal<any>([]);
  public isLoaded = signal<boolean>(true);
  public isError = signal<boolean>(false);

  public ngOnInit() {
    this.getPosts()
  }

  public reloadDataPost() {
    this.isLoaded.set(true);
    this.isError.set(false);
    this.getPosts()
  }

  private getPosts() {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.isLoaded.set(false);
      },

      error: (error) => {
        console.log(error);
        this.isLoaded.set(false);
        this.isError.set(true);
      }
    })
  }
}
