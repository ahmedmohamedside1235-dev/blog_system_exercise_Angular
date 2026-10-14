import { SlicePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-post',
  imports: [SlicePipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {

  public post = input.required<any>();
  public operation = input.required<boolean>();

  public postService = inject(PostService);
  public notification = inject(NotificationService);

  public postDeletedOrRestore = output<any>();
  public postForceDeleted = output<string>();
  public postRestored = output<string>();
  public postUpdated = output<any>();
  public editRequested = output<any>();

  public postData = signal<any>(null);
  public isrequested = signal<boolean>(false);
  public isDisabled = input<boolean>(false);

  public constructor() {
    effect(() => {
      let disabled = this.isDisabled();
      this.isrequested.set(disabled);
    })
  }

  // soft delete post
  public deletePost(id: string) {

    if (this.isrequested() || this.isDisabled()) return;
    this.isrequested.set(true);

    this.notification.show('Wait to delete your post', 'success');

    this.postService.deletePost(id).subscribe({
      next: (response: any) => {
        this.postDeletedOrRestore.emit({ post: response.post, message: 'deleted' });
        this.isrequested.set(false);
      },

      error: (errors) => {
        console.log(errors);
        this.isrequested.set(false);
        let message = errors.error?.message ?? 'Something went wrong, please try again';
        this.notification.show(message, 'error');
      }
    })
  }

  // force delete post
  public forceDeletePost(id: string) {
    if (this.isrequested() || this.isDisabled()) return;
    this.isrequested.set(true);

    this.notification.show('Wait to force delete your post', 'success');

    this.postService.forceDeletedPost(id).subscribe({
      next: () => {
        this.postForceDeleted.emit(id);
        this.isrequested.set(false);
      },

      error: (errors) => {
        console.log(errors);
        this.isrequested.set(false);
        let message = errors.error?.message ?? 'Something went wrong, please try again';
        this.notification.show(message, 'error');
      }
    })
  }

  // restore post after soft delete
  public restorePost(id: string) {

    if (this.isrequested() || this.isDisabled()) return;
    this.isrequested.set(true);

    this.notification.show('Wait to restore your post', 'success');
    this.postService.restoredPost(id).subscribe({
      next: (response: any) => {
        this.postDeletedOrRestore.emit({ post: response.post, message: 'restored' });
        this.isrequested.set(false);
      },

      error: (errors) => {
        console.log(errors);
        this.isrequested.set(false);
        let message = 'Something went wrong, please try again';
        this.notification.show(message, 'error');
      }
    })
  }

}
