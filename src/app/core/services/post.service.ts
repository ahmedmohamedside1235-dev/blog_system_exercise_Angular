import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { NewPost, Post } from '../models/new-post-model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private readonly URL_ORIGIN = 'https://exserciselaravel.atwebpages.com/api/post';
  private loadSub?: Subscription;

  private _posts = signal<Post[]>([]);
  public posts = this._posts.asReadonly();
  public isLoading = signal<boolean>(true);
  public isError = signal<boolean>(false);

  // get posts from server
  public load(trashed = false): void {
    // cancel the previous request to avoid race conditions
    this.loadSub?.unsubscribe();

    this._posts.set([]);
    this.isLoading.set(true);
    this.isError.set(false);

    this.loadSub = this.http.post<Post[]>(`${this.URL_ORIGIN}/getAll`, { trashed }).subscribe({
      next: (data) => {
        this._posts.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.isError.set(true);
      },
    });
  }

  public addPost(post: NewPost) {
    return this.http
      .post<{ message: string; post: Post }>(`${this.URL_ORIGIN}/create`, post)
      .pipe(tap((response) => this._posts.update((posts) => [response.post, ...posts])));
  }

  public updatePost(post: NewPost) {
    return this.http
      .post<{ post: Post }>(`${this.URL_ORIGIN}/update`, post)
      .pipe(tap((response) => this.replacePost(response.post)));
  }

  // soft delete
  public deletePost(post: Post) {
    return this.http
      .delete<{ post: Post }>(`${this.URL_ORIGIN}/delete`, { body: { id: post.id } })
      .pipe(tap((response) => this.replacePost(response.post)));
  }

  public restorePost(post: Post) {
    return this.http
      .post<{ post: Post }>(`${this.URL_ORIGIN}/restore`, { id: post.id })
      .pipe(tap((response) => this.replacePost(response.post)));
  }

  public forceDeletePost(post: Post) {
    return this.http
      .delete(`${this.URL_ORIGIN}/force_delete`, { body: { id: post.id } })
      .pipe(tap(() => this._posts.update((posts) => posts.filter((p) => p.id !== post.id))));
  }

  private replacePost(updated: Post): void {
    this._posts.update((posts) => posts.map((p) => (p.id === updated.id ? updated : p)));
  }
}