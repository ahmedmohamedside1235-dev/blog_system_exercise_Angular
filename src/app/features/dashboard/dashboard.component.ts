import { Component, inject, signal } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { PostComponent } from '../post/post.component';
import { LoadingPostComponent } from '../../shared/components/loading-post/loading-post.component';
import { AddOrUpdatePostComponent } from '../../shared/components/add-post/addOrUpdate-post.component';
import { NotificationService } from '../../core/services/notification.service';
import { NewPost } from '../../core/models/new-post-model';

@Component({
  selector: 'app-dashboard',
  imports: [PostComponent, LoadingPostComponent, AddOrUpdatePostComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private postService = inject(PostService);
  private notificationService = inject(NotificationService);

  public posts = signal<any[]>([]);
  public isLoaded = signal<boolean>(true);
  public isError = signal<boolean>(false);
  public isUpdateForm = signal<boolean>(false);
  public editingPost = signal<any>(null);
  public waitingUpdatePost = signal<boolean>(false);

  // get all posts
  public ngOnInit() {
    this.getPosts()
  }

  // if error found during get posts
  public reloadDataPost() {
    this.isLoaded.set(true);
    this.isError.set(false);
    this.getPosts()
  }

  // get posts from server
  private getPosts() {
    this.postService.getAllPosts(true).subscribe({
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

  // add post and update signal posts
  public onPostAdded(post: NewPost) {
    this.postService.addPost(post).subscribe({
      next: (response: any) => {
        console.log(response);
        this.notificationService.show(response.message, 'success');
        this.posts.update((currentPosts) => [response.post, ...currentPosts]);
      },
      error: (errors) => {
        console.log(errors);
        let message = errors.error?.message ?? 'Something went wrong, please try again';
        this.notificationService.show(message, 'error');
      }
    })
  }

  // for update post or soft delete post or restore post 
  public onPostUpdated(event: any) {
    this.posts.update((posts) =>
      posts.map((post) => (post.id === event.post.id ? event.post : post))
    );

    this.notificationService.show(`The Post has been ${event.message} successfully.`);
  }

  // force delete post
  public onPostForceDeleted(postId: any) {
    this.posts.update((posts) => posts.filter((post) => post.id !== postId));
    this.notificationService.show('The Post has been force deleted successfully.');
  }

  // set post to insert it into component form
  public onEditRequested(post: any) {
    this.editingPost.set(post);
  }

  // send update  post and update signal
  public onPostEdited(post: any) {
    this.waitingUpdatePost.set(true);
    this.postService.updatedPost(post).subscribe({
      next: (response: any) => {
        this.waitingUpdatePost.set(false);
        this.onPostUpdated({ post: response.post, message: 'updated' });
      },
      error: (errors) => {
        const message = errors.error?.message ?? 'Something went wrong, please try again';
        this.waitingUpdatePost.set(false);
        this.notificationService.show(message, 'error');
      },
    });
  }
}
