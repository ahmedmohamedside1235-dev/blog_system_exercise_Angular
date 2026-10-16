import { Component, inject, input, signal } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { LoadingPostComponent } from '../../shared/components/loading-post/loading-post.component';
import { NotificationService } from '../../core/services/notification.service';
import { NewPost, Post } from '../../core/models/new-post-model';
import { PostComponent } from './post/post.component';
import { AddOrUpdatePostComponent } from '../../shared/components/add-post/addOrUpdate-post.component';
import { Observable } from 'rxjs';
import { PaginationComponent } from './pagination/pagination.component';

@Component({
  selector: 'app-posts',
  imports: [LoadingPostComponent, PostComponent, AddOrUpdatePostComponent, PaginationComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent {

  public postService = inject(PostService);
  public notification = inject(NotificationService);

  public isTrashed = input<boolean>(false);

  public isRequested = signal<boolean>(false);
  public postDataForm = signal<Post | null>(null);
  public paginateIsDone = signal<boolean>(false);
  public pendingId = signal<string | null>(null);

  public ngOnInit() {
    this.postService.load(this.isTrashed(), 1);
  }

  public reloadDataPost() {
    this.postService.load(this.isTrashed(), 1);
  }

  public paginatePost(page: number) {
    this.postService.load(this.isTrashed(), page);
    this.paginateIsDone.set(true);
  }

  // soft delete post
  public deletePost(post: Post) {
    this.run(this.postService.deletePost(post), 'Wait to delete your post', `The Post has been deleted successfully.`, post.id);
  }

  // restore post after soft delete
  public restorePost(post: Post) {
    this.run(this.postService.restorePost(post), 'Wait to restore your post', `The Post has been restored successfully.`, post.id);
  }

  // force delete post
  public forceDeletePost(post: Post) {
    this.run(this.postService.forceDeletePost(post), 'Wait to force delete your post', `The Post has been force delete successfully.`, post.id, () => {
      this.postService.load(this.isTrashed(), 1);
    });
    this.postService.load(this.isTrashed(), 1);
  }

  // edit post
  public editPost(post: NewPost & { id: string }) {
    this.run(this.postService.updatePost(post), 'Wait to update your post', `The Post has been updated successfully.`, post.id);
  }

  // add post
  public addPost(post: NewPost) {
    this.run(this.postService.addPost(post), 'Wait to add post your post', `The Post has been added successfully.`, null, () => {
      this.postService.load(this.isTrashed(), 1);
    });
  }

  // send post data to component addOrUpdate-post
  public insertPostIntoForm(post: Post) {
    this.postDataForm.set(post);
  }

  private run<T>(request$: Observable<T>, waitMsg: string, successMsg: string, postId: string | null = null, onSuccess?: () => void) {
    if (this.isRequested()) return;
    this.isRequested.set(true);
    this.pendingId.set(postId);
    this.notification.show(waitMsg);

    request$.subscribe({
      next: () => {
        this.notification.show(successMsg);
        this.isRequested.set(false);
        this.pendingId.set(null);
        onSuccess?.();
      },

      error: (err) => {
        this.isRequested.set(false);
        this.pendingId.set(null);
        this.notification.show(err.error?.message ?? 'Something went wrong, please try again', 'error')
      },

    });
  }
}


