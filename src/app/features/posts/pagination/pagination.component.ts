import { Component, computed, effect, EventEmitter, inject, input, output, signal } from '@angular/core';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  public postService = inject(PostService);

  public requestDoneOrError = input<boolean>(false)

  public paginatePost = output<number>()

  public requestRun = signal<boolean>(false);


  public constructor() {
    effect(() => {
      this.requestRun.set(!this.requestDoneOrError());
    })
  }

  public pages = computed(() =>
    Array.from({ length: this.postService.totalPage() }, (_, i) => i + 1)
  );

  public goTo(page: number) {
    if (<number>page < 1 || <number>page > this.postService.totalPage() || (<number>page == this.postService.currentPage())) return;
    this.paginatePost.emit(page);
  }
}
