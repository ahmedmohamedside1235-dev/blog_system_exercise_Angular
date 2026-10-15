import { SlicePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Post } from '../../../core/models/new-post-model';

@Component({
  selector: 'app-post',
  imports: [SlicePipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {

  public post = input.required<any>();
  public operation = input.required<boolean>();
  public pendingPost = input<string | null>();

  public postDeleteRequested = output<Post>();
  public postRestoreRequested = output<Post>();
  public postForceDeleteRequested = output<Post>();
  public postEditRequested = output<Post>();


  // send request to parent to soft delete post
  public deletePost(post: Post) {
    this.postDeleteRequested.emit(post);
  }

  // send request to parent to force delete post
  public forceDeletePost(post: Post) {
    this.postForceDeleteRequested.emit(post);
  }

  // send request to parent to restore post after soft delete
  public restorePost(post: Post) {
    this.postRestoreRequested.emit(post)
  }

  public editPost(post: Post) {
    this.postEditRequested.emit(post);
  }

}
